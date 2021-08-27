/* tslint:disable */

import { ApolloLink, Observable, RequestHandler, fromError } from 'apollo-link';
import _ from 'lodash';
import {
  serializeFetchParameter,
  selectURI,
  parseAndCheckHttpResponse,
  checkFetcher,
  selectHttpOptionsAndBody,
  createSignalIfSupported,
  fallbackHttpConfig,
  Body,
  httpOptions,
  fetchOptions,
  UriFunction as _UriFunction,
} from 'apollo-link-http-common';
import { DefinitionNode } from 'graphql';



export default ({uri = '/graphql',
// use default global fetch if nothing passed in
fetcher,
includeExtensions,
useGETForQueries,
...requestOptions
} = {}) => {
  console.log("reqOptions",requestOptions);
  // dev warnings to ensure fetch is present
  //checkFetcher(fetcher);

  //fetcher is set here rather than the destructuring to ensure fetch is
  //declared before referencing it. Reference in the destructuring would cause
  //a ReferenceError
  if (!fetcher) {
    fetcher = fetch;
  }
  console.log("fetcher",fetcher);
  const linkConfig = {
    http: { includeExtensions },
    options: requestOptions.fetchOptions,
    credentials: requestOptions.credentials,
    headers: requestOptions.headers,
  };



  return new ApolloLink(operation => {
    let chosenURI = selectURI(operation, uri);

    const context = operation.getContext();

    // `apollographql-client-*` headers are automatically set if a
    // `clientAwareness` object is found in the context. These headers are
    // set first, followed by the rest of the headers pulled from
    // `context.headers`. If desired, `apollographql-client-*` headers set by
    // the `clientAwareness` object can be overridden by
    // `apollographql-client-*` headers set in `context.headers`.
    const clientAwarenessHeaders = {};
    if (context.clientAwareness) {
      const { name, version } = context.clientAwareness;
      if (name) {
        clientAwarenessHeaders['apollographql-client-name'] = name;
      }
      if (version) {
        clientAwarenessHeaders['apollographql-client-version'] = version;
      }
    }

    const contextHeaders = { ...clientAwarenessHeaders, ...context.headers };

    const contextConfig = {
      http: context.http,
      options: context.fetchOptions,
      credentials: context.credentials,
      headers: contextHeaders,
    };

    //uses fallback, link, and then context to build options
    let { options, body } = selectHttpOptionsAndBody(
      operation,
      fallbackHttpConfig,
      linkConfig,
      contextConfig,
    );
    console.log("BODyyyyyy",body);
    console.log("OPerationooo",operation);
    const {operationName,extensions,variables,query}=operation;

    console.log("variables",variables);
    
    
    return new Observable(observer => {

      const {
        headers,
        credentials,
        fetchOptions={},
        uri:contextURI,
        http:httpOptions={}
      }=operation.getContext();

      const {operationName,extensions,variables,query}=operation;
      const http={...httpOptions};
      //const body={operationName,variables};

     /*if(includeExtensions || http.includeExtensions)
        (body).extensions=extensions;*/
      
      console.log("bodyreal",body);
      /*if(http.includeQuery){
        console.log("query",query);
        body.query=query;
      }*/
      let serializedBody;
      try{
        serializedBody=JSON.stringify(body);
        console.log("serializedbody",serializedBody);
      }catch(e){
        const parseError=new Error('Network request failed, object not serilizable'+e.message);
        parseError.parseError=e;
        throw parseError;

      }
      let options=fetchOptions;
      /*if(requestOptions.fetchOptions)
        options={...requestOptions.fetchOptions,...options};*/
      console.log("QUERY",body.query);
      console.log("OPtions",options);
      
      let fetcherOptions={
        method:"POST",
        //...options,
        body:serializedBody,
        headers:{
          accept:'*/*',
          'content-type':'application/json'
        }
        
      };
      let bodyQuery=body.query;
      let bqstr=JSON.stringify(bodyQuery);
      bqstr='{"query":'+bqstr+',';
      console.log("bodyquery",bqstr);
      let bodyVariables=body.variables;
      let bvstr=JSON.stringify(bodyVariables);
      console.log("variablesfile1",body.variables.file1);
      console.log("bodyvariables",body.variables);
      let bodyTotal=bqstr+bvstr;
      //body.variables.file1.path="path";
      let resto="{\"query\":"+JSON.stringify(body.query)+",\"variables\":"+JSON.stringify(body.variables)+"}";
      console.log("Resto",resto);
    console.log("Parseresto",JSON.parse(resto));
      //body={query:body.query+resto,variables:body.variables};
      console.log("bodyyyyyyy",body);
      let bodyFormData=new FormData();
        bodyFormData.append("operations",
        JSON.stringify(body));
        bodyFormData.append('file1',
          body.variables.file1);
      let fetcherFileOptions={
        method:'POST',
        body:bodyFormData,
        //headers:{'Content-Type': 'multipart/form-data'}
      };
      
      let x=0;
      if(_.has(variables,'file1')){
        console.log("varfile",variables.file1);
        console.log("body formdata",body);
        x=2;
      }else{
        console.log("entro aqui");
        x=1;
        console.log("FOOO",fetcherOptions);
        console.log("FETCHOPTIONS",fetcherOptions);
      }

      let turno={};
      if(x==1){
        turno=fetcherOptions;
      }else if(x==2){
        turno=fetcherFileOptions;
      }
      
      if(requestOptions.credentials)
        turno.credentials=requestOptions.credentials;
      if(credentials)
        turno.credentials=credentials;  
      if(headers)
        turno.headers={...headers,...turno.headers};
      console.log("CURI",uri);
      console.log("TURNO", turno);
      if(x==1){
        return fetcher(uri, turno)
          .then(response => {
            console.log("response 1",response);
            operation.setContext({ response });
            return response;
          })
          .then(parseAndCheckHttpResponse(operation))
          .then(result => {
            console.log("result",result);
            // we have data and can send it to back up the link chain
            observer.next(result);
            observer.complete();
            return result;
          })
          .catch(err => {
          
            if (err.name === 'AbortError') {
              return;
            }
            observer.error(err);
          });
      }else if(x==2){
        return fetcher(uri, turno)
        .then(response => {
          console.log("response 1",response);
          operation.setContext({ response });
          return response;
        })
        .then(parseAndCheckHttpResponse(operation))
        .then(result => {
          console.log("result",result);
          // we have data and can send it to back up the link chain
          observer.next(result);
          observer.complete();
          return result;
        })
        .catch(err => {
        
          if (err.name === 'AbortError') {
            return;
          }
          observer.error(err);
        });
    } 
      

      /*return () => {
        if (controller) controller.abort();
      };*/
    });
  });
};

/*
    let controller;
    if (!(options).signal) {
      const { controller: _controller, signal } = createSignalIfSupported();
      controller = _controller;
      if (controller) (options).signal = signal;
    }

    // If requested, set method to GET if there are no mutations.
    const definitionIsMutation = (d) => {
      return d.kind === 'OperationDefinition' && d.operation === 'mutation';
    };
    if (
      useGETForQueries &&
      !operation.query.definitions.some(definitionIsMutation)
    ) {
      options.method = 'GET';
    }

    
      const { newURI, parseError } = rewriteURIForGET(chosenURI, body);
    if (options.method === 'GET') {
      if (parseError) {
        return fromError(parseError);
      }
      chosenURI = newURI;
    } else {
      try {
        (options).body = serializeFetchParameter(body, 'Payload');
      } catch (parseError) {
        return fromError(parseError);
      }
    }

    /*return new Observable(observer => {
      fetcher(chosenURI, options)
        .then(response => {
          operation.setContext({ response });
          return response;
        })
        .then(parseAndCheckHttpResponse(operation))
        .then(result => {
          // we have data and can send it to back up the link chain
          observer.next(result);
          observer.complete();
          return result;
        })
        .catch(err => {
          // fetch was cancelled so it's already been cleaned up in the unsubscribe
          if (err.name === 'AbortError') return;
          // if it is a network error, BUT there is graphql result info
          // fire the next observer before calling error
          // this gives apollo-client (and react-apollo) the `graphqlErrors` and `networErrors`
          // to pass to UI
          // this should only happen if we *also* have data as part of the response key per
          // the spec
          if (err.result && err.result.errors && err.result.data) {
            // if we don't call next, the UI can only show networkError because AC didn't
            // get any graphqlErrors
            // this is graphql execution result info (i.e errors and possibly data)
            // this is because there is no formal spec how errors should translate to
            // http status codes. So an auth error (401) could have both data
            // from a public field, errors from a private field, and a status of 401
            // {
            //  user { // this will have errors
            //    firstName
            //  }
            //  products { // this is public so will have data
            //    cost
            //  }
            // }
            //
            // the result of above *could* look like this:
            // {
            //   data: { products: [{ cost: "$10" }] },
            //   errors: [{
            //      message: 'your session has timed out',
            //      path: []
            //   }]
            // }
            // status code of above would be a 401
            // in the UI you want to show data where you can, errors as data where you can
            // and use correct http status codes
            observer.next(err.result);
          }
          observer.error(err);
        });

      return () => {
        // XXX support canceling this request
        // https://developers.google.com/web/updates/2017/09/abortable-fetch
        if (controller) controller.abort();
      };
    });
  });
};*/

// For GET operations, returns the given URI rewritten with parameters, or a
// parse error.
/*function rewriteURIForGET(chosenURI, body) {
  // Implement the standard HTTP GET serialization, plus 'extensions'. Note
  // the extra level of JSON serialization!
  const queryParams = [];
  const addQueryParam = (key, value) => {
    queryParams.push(`${key}=${encodeURIComponent(value)}`);
  };

  if ('query' in body) {
    console.log("BOdyqueryyyyyy",body.query);
    addQueryParam('query', body.query);
  }
  if (body.operationName) {
    console.log("OPerationNamedddd",body.operationName);
    addQueryParam('operationName', body.operationName);
  }
  if(body.variables) {

    console.log("BOdyvariablessss",body.variables);
    /*let serializedVariables;
    try {
      serializedVariables = serializeFetchParameter(
        body.variables,
        'Variables map',
      );
    } catch (parseError) {
      return { parseError };
    }*/
    //añadido de fileupload
    //let options=fetchOptions;
   //console.log("OPtionssss",options);
    /*console.log("****************************Options");
    //if(requestOptions.fetchOptions)
     //options={...requestOptions.fetchOptions,...options};
     const fetchOptions={
       method:'POST',
       //...options,
       headers:{
         /*accept:*/
      //   'content-type':'application/json',
         
     /*  }
     };
    if(_.has(body.variables,'file')){
      fetchOptions.body=new FormData();
      fetchOptions.body.append('operations',JSON.stringify(body));
      fetchOptions.body.append('file',body.variables.file);;
    
      
    }else{
      fetchOptions.headers['content-type']='application/json';
      fetchOptions.body=JSON.stringify(body);
    }


    addQueryParam('variables', JSON.stringify(body.variables));
  }
  if (body.extensions) {
    let serializedExtensions;
    try {
      serializedExtensions = serializeFetchParameter(
        body.extensions,
        'Extensions map',
      );
    } catch (parseError) {
      return { parseError };
    }
    addQueryParam('extensions', serializedExtensions);
  }

  // Reconstruct the URI with added query params.
  // XXX This assumes that the URI is well-formed and that it doesn't
  //     already contain any of these query params. We could instead use the
  //     URL API and take a polyfill (whatwg-url@6) for older browsers that
  //     don't support URLSearchParams. Note that some browsers (and
  //     versions of whatwg-url) support URL but not URLSearchParams!
  /*let fragment = '',
    preFragment = chosenURI;
  const fragmentStart = chosenURI.indexOf('#');
  if (fragmentStart !== -1) {
    fragment = chosenURI.substr(fragmentStart);
    preFragment = chosenURI.substr(0, fragmentStart);
  }
  const queryParamsPrefix = preFragment.indexOf('?') === -1 ? '?' : '&';
  const newURI =
    preFragment + queryParamsPrefix + queryParams.join('&') + fragment;
  return { newURI };
}*/

/*export class HttpLink extends ApolloLink {
  requester;
  constructor(opts) {
    super(createHttpLink(opts).request);
  }
}*/