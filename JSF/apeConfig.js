/***
 * APE JSF Setup
 */

APE.Config.baseUrl = 'http://ape.local:8080/JSF'; //Core file location 
APE.Config.domain = 'auto'; //Website domain ?
APE.Config.server = 'ape.local:6969'; //APE server URL

/***
 * APE CORE Files
 */

APE.Config.scripts.push(APE.Config.baseUrl + '/apeCore.min.js');
//APE.Config.scripts.push(APE.Config.baseUrl + '/apeCoreSession.min.js'); //Uncomment to enable Sessions