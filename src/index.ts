import {startApplication} from "./app";
import {GlobalContext} from "./core/context/global";
import {DatasourceBindings} from "./datasources/bindings";

GlobalContext.get().bind(DatasourceBindings.MongoDatabaseName,  'NetGuru' );
GlobalContext.get().bind(DatasourceBindings.MongoUrl,  'mongodb://database' );
startApplication()
    .then(() => {
        console.log('Server started on port 3000')
    })
    .catch(() => {
        console.error('Failed to start the server')
    })