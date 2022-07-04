# User Interface

Tentacle PLC UI is a web interface Tentacle PLC. It interacts directly with the GraphQL API, and allows for basic PLC functionality like starting/stoping/restarting the PLC, monitoring code execution and manipulating variables.

![Tentacle PLC](https://res.cloudinary.com/jarautomation/image/upload/f_auto/v1646799504/Tentacle%20PLC%20Docs/Tentacle%20PLC%20Main.png)

## Configuration
Configuration of the user interface is done via environment variables. These settings tell the user interface application where to interface with the PLC and where Code Server is so the edit links function properly.

The Tentacle PLC UI is built using [NuxtJS](https://nuxtjs.org/). This means it will render the application on the server before sending the appropriate HTML, CSS, and Javascript to your browser. To make this possible, the user interface application needs to request data from Tentacle PLC on the server as well ass the client. Connection paths are often different when making requests from the server vs. making requests from the client so there are environment variables to set them independently.

For the server connection string `{TENTACLE_SERVER_PROTOCOL}://{TENTACLE_SERVER_HOST}:{TENTACLE_SERVER_PORT}{TENTACLE_SERVER_URL}`:
* TENTACLE_SERVER_HOST: *Default - localhost* Set this to the hostname the user interface should use to connect to Tentacle PLC from the server.
* TENTACLE_SERVER_PROTOCOL: *Default - http* Set this `http` or `https` depending on the protocol you use to access your Tentacle PLC from the server.
* TENTACLE_SERVER_PORT: *Default - 4000* Set this to the port the user interface should use to connect to Tentacle PLC from the server.
* TENTACLE_SERVER_URL: *Default - /* Set this to the url path the user interface should use to connect to Tentacle PLC from the server.

For the client connection string `{TENTACLE_CLIENT_PROTOCOL}://{TENTACLE_CLIENT_HOST}:{TENTACLE_CLIENT_PORT}{TENTACLE_CLIENT_URL}`:
* TENTACLE_CLIENT_HOST: *Default - the value of window.location.hostname* Set this to the hostname the user interface should use to connect to Tentacle PLC from the browser.
* TENTACLE_CLIENT_PROTOCOL: *Default - http* Set this `http` or `https` depending on the protocol you use to access your Tentacle PLC from the browser.
* TENTACLE_CLIENT_PORT: *Default - 4000* Set this to the port the user interface should use to connect to Tentacle PLC from the browser.
* TENTACLE_CLIENT_URL: *Default - /* Set this to the url path the user interface should use to connect to Tentacle PLC from the browser.

We prefer to use [Code Server](https://github.com/coder/code-server) to edit the PLC code from the browser. The user interface edit buttons redirect you to your code-server environment. These environment variables let you configure the redirect path for the user interface or disable the edit buttons all together.

For the code-server connection string `{TENTACLE_CODESERVER_PROTOCOL}://{TENTACLE_CODESERVER_HOST}:{TENTACLE_CODESERVER_PORT}{TENTACLE_CODESERVER_URL}`:
* TENTACLE_CODESERVER_HOST: *Default - the value of window.location.hostname* Set this to the hostname of your Code Server.
* TENTACLE_CODESERVER_PROTOCOL: *Default - http* Set this `http` or `https` depending on the protocol you use to access your Code Server.
* TENTACLE_CODESERVER_PORT: *Default - 4000* Set this to the port the user interface should use to connect to Code Server.
* TENTACLE_CODESERVER_URL: *Default - /* Set this to the url path the user interface should use to connect to Code Server. 


