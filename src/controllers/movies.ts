import Koa from "koa";
import {get, post} from "../core/routes/decorators";
import {ZoneContext} from "../core/context/zone";
import {DatasourceBindings} from "../datasources/bindings";
import {HttpErrors} from "../core/errors";
import {AuthBindings} from "../core/auth/bindings";
import {User} from "../core/auth/types";
import moment from "moment";
import {onlyLoggedIn} from "../core/auth/decorators";
import {GlobalContext} from "../core/context/global";

export class MoviesController {
    @get('/movies')
    fetchMovies(ctx: Koa.Context) {
        const db = GlobalContext.get()?.getValue(DatasourceBindings.Mongo);
        if (!db)
            throw new HttpErrors.InternalError();
        return db.collection('movies').find({}, {projection: {_id: 0, _createdBy: 0, _createdAt: 0}}).toArray()
    }

    @post('/movies')
    @onlyLoggedIn
    async createMovie(ctx: Koa.Context) {
        const db = GlobalContext.get()?.getValue(DatasourceBindings.Mongo);
        const axios = GlobalContext.get()?.getValue(DatasourceBindings.Axios);
        if (!db || !axios)
            throw new HttpErrors.InternalError();

        const {title} = ctx.request.body;
        if (!title)
            throw new HttpErrors.BadRequest('Title is required');
        const {userId, role} = ZoneContext.get()?.getValue(AuthBindings.User) as User;

        const count = await db.collection('movies').find({
            _createdBy: userId,
            _createdAt: {
                "$gte": moment().startOf('month').toISOString(),
                "$lte": moment().endOf('month').toISOString()
            }
        }).count()

        if (role === 'basic' && count >= 5)
            throw new HttpErrors.Forbidden('Your tier does not allow to create more movies this month.')

        const movieRaw = await axios.get('', {
            params: {
                t: title
            }
        })
        const movie = movieRaw.data;

        if(!movie|| movie.Response ==='False')
            throw new HttpErrors.BadRequest('Movie does not exist');

        await db.collection('movies').insertOne({
            Title: movie.Title,
            Released: movie.Released,
            Genre: movie.Genre,
            Directory: movie.Director,
            _createdBy: userId,
            _createdAt: moment().toISOString()
        })
    }
}
