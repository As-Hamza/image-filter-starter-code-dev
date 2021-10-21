import express, { NextFunction, Request, Response} from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]


  // This function from "stackoverflow.com"
  function validate_URL(pURL: string) {
    var regexQuery = "^(https?://)?(www\\.)?([-a-z0-9]{1,63}\\.)*?[a-z0-9][-a-z0-9]{0,61}[a-z0-9]\\.[a-z]{2,6}(/[-\\w@\\+\\.~#\\?&/=%]*)?$";
    var url = new RegExp(regexQuery,"i");
    return url.test(pURL);
  }
  
    app.get( "/filteredimage", async ( req: Request, res: Response, next: NextFunction ) => {
  
      // 1. validate the image_url query
      
      let image_url = req.query.image_url;
      //let is_image_url_valid = validate_URL(image_url);
      if(!image_url){
        res.status(400).send("image url missing")

      } else {
        if(!validate_URL(image_url)){
          res.status(404).send('The image URL that was sent is incorrect, please check the image URL.')

        }
        else {
          try {
          // 2. call filterImageFromURL(image_url) to filter the image
          //let image_reponse = await filterImageFromURL(image_url);
          let absolutePath: string = await filterImageFromURL(req.query.image_url) as string;
          if(absolutePath = "no image found"){
            res.status(200).send("No image found at this given URL.")

          } else {
            // 3. send the resulting file in the response
            res.sendFile(absolutePath);
            res.on('finish', () => deleteLocalFiles([absolutePath])); 
          }
          } catch (e) {
          // other errors
          console.error(e)
          next(e)
          }
        
        }

      }
      
    });

  /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();