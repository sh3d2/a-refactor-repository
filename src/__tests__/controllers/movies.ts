import {DatasourceBindings} from "../../datasources/bindings";
import {GlobalContext} from "../../core/context/global";
import {startApplication} from "../../app";
import supertest from 'supertest';
import {Server} from "http";
import jwt from 'jsonwebtoken'
import {AuthBindings} from "../../core/auth/bindings";

describe('Movies controller',()=>{
    let request: supertest.SuperTest<supertest.Test>;
    let app: Server;

    beforeAll(async () => {
        app = await startApplication();
        request = supertest(app);
    })

    afterAll(async () => {
        await app.close()
        await GlobalContext.get()?.getValue(DatasourceBindings.MongoClient)?.close();
    })

    beforeEach(async () => {
        const database = GlobalContext.get().getValue(DatasourceBindings.Mongo);
        await database?.collection('movies').deleteMany({});
    })

    describe('GET /movies', () => {

        it('Empty list', async () => {
            const response = await request.get('/movies').expect(200)
            expect(response.body).toEqual([]);
        })

        it('Non-empty list', async () => {
            const database = GlobalContext.get().getValue(DatasourceBindings.Mongo);
            await database?.collection('movies').insertOne({
                "Title": "Inter Star Wars 2. The Last Jehi",
                "Released": "16 Nov 2017",
                "Genre": "Action, Comedy, Horror, Sci-Fi",
                "Directory": "Sergey A., Semyon Romanov",
                "_createdBy": 123,
                "_createdAt": "2021-02-09T19:10:21+00:00"
            })


            const response = await request.get('/movies').expect(200)
            expect(response.body).toEqual([{
                "Title": "Inter Star Wars 2. The Last Jehi",
                "Released": "16 Nov 2017",
                "Genre": "Action, Comedy, Horror, Sci-Fi",
                "Directory": "Sergey A., Semyon Romanov"
            }]);

        })

        it('Passing query', async () => {
            const response = await request.get('/movies?testQuery=1').expect(200)
            expect(response.body).toEqual([]);
        })

        it('Subpage', async () => {
            const response = await request.get('/movies/1').expect(404)
            expect(response.body).toEqual({code: 404, message: 'NotFound'});
        })
    })
    describe('POST /movies', () => {

        let token:string;
        beforeAll(()=>{
            token = jwt.sign({
                    userId: 123,
                    role: "basic",
                    name: "Basic Thomas"
                },
                GlobalContext.get().getValue(AuthBindings.Secret) as string
            )
        })

        it('Empty request', async () => {
            const response = await request.post('/movies').expect(401)
            expect(response.body).toEqual({code: 401, message: 'Unauthorized'});
        })
        it('Unauthorized request with body', async () => {
            const response = await request.post('/movies').send({title:'star wars'}).expect(401)
            expect(response.body).toEqual({code: 401, message: 'Unauthorized'});

        })
        it('Authorized request', async () => {
            const response = await request.post('/movies').set("Authorization",`Bearer ${token}`).expect(400)
            expect(response.body).toEqual({code: 400, message: 'Title is required'});
        })

        it('Authorized request with body', async () => {
            const response = await request
                .post('/movies')
                .set("Authorization",`Bearer ${token}`)
                .send({name:'star wars'})
                .expect(400)
            expect(response.body).toEqual({code: 400, message: 'Title is required'});
        })

        it('Authorized request with correct body, but movie does not exist', async () => {
            const response = await request
                .post('/movies')
                .set("Authorization",`Bearer ${token}`)
                .send({title:'it'})
                .expect(400)
            expect(response.body).toEqual({code: 400, message: 'Movie does not exist'});
        })

        it('Authorized request with correct body', async () => {
            const response = await request
                .post('/movies')
                .set("Authorization",`Bearer ${token}`)
                .send({title:'star wars'})
                .expect(200)
        })
    })
    
})
