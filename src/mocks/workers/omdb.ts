import {rest} from 'msw'
import {setupServer} from "msw/node";
import * as url from "url";
import * as querystring from "querystring";

export const handlers = [

    // Handles a POST /login request

    rest.get('http://www.omdbapi.com', (req, res, ctx) => {
        const query = querystring.parse(req.url.searchParams.toString());
        const {t} = query as { t?: string };
        if (!t) {
            return res(ctx.json({"Response": "False", "Error": "Incorrect IMDb ID."}));
        }
        if (t.match(new RegExp('star wars', 'i'))) {

            return res(ctx.json({
                "Title": "Star Wars: Episode IV - A New Hope",
                "Released": "25 May 1977",
                "Genre": "Action, Adventure, Fantasy, Sci-Fi",
                "Director": "George Lucas",
            }));
        }
        if (t.match(new RegExp("star wars 2", 'i'))) {


            return res(ctx.json({
                    "Title": "Inter Star Wars 2. The Last Jehi",
                    "Released": "16 Nov 2017",
                    "Genre": "Action, Comedy, Horror, Sci-Fi",
                    "Director": "Sergey A., Semyon Romanov"
                }
            ));
        }
        return res(ctx.json({"Response": "False", "Error": "Movie not found!"}));
    }),
]

export const server = setupServer(...handlers)