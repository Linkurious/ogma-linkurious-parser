# Ogma-Linkurious Parser 

## Description
Ogma-Linkurious Parser is an official library maintained by the Linkurious team that allows you to quickly parse and load a Linkurious visualization in Ogma with one line of code and apply different Linkurious Enterprise styles, filters, captions and more.

### Prerequisites
- Linkurious Enterprise 2.10.x or above
- An existing visualization to export 
- An Ogma license

# Installation

````npm install @linkurious/ogma-parser````

# Usage

In order to create an Ogma visualization with your Linkurious styles:

1. Get your visualization using [Linkurios REST API](https://doc.linkurio.us/server-sdk/latest/apidoc/#api-Visualization-getVisualization).


2. Get the Linkurious configuration using [Linkurios REST API](https://doc.linkurio.us/server-sdk/latest/apidoc/#api-Config-getConfiguration).


3. Initialize `LKOgma` and call `initVisualization` with the configuration and the visualization data from the previous steps.


A full working example using the [Linkurious REST Client](https://github.com/Linkurious/linkurious-rest-client/) library:

```js
const {RestClient} = require('@linkurious/rest-client');
const {LKOgma} = require('@linkurious/ogma-linkurious-parser');

async function main() {
  // Initialize the rest client
  const rc = new RestClient({baseUrl: 'http://localhost:3000'});
  
  // Log in
  await rc.auth.login({
    usernameOrEmail: 'your-username',
    password: 'your-password'
  });

  // Get linkurious configuration response
  const linkuriousConfigurationResponse = await rc.config.getConfiguration();

  // Get the visualisation configuration response
  const visualizationResponse = await rc
      .visualization.getVisualization({
          sourceKey: 'e7900d9b',
          id: 3
      });

  if (linkuriousConfigurationResponse.isSuccess() && visualizationResponse.isSuccess()) {
      const ogmaConfiguration = linkuriousConfigurationResponse.body.ogma;

      const visualizationConfiguration = visualizationResponse.body;

       // Initialize ogma object
       const ogma = new LKOgma({
          ...ogmaConfiguration,
          options: {
            ...ogmaConfiguration.options,
            backgroundColor: 'rgba(240, 240, 240)'
          }
      });

      // Set HTML container where Ogma will be rendered
      ogma.setContainer('graph-container');

      // Initialize the visualization content & styles
      ogma.initVisualization(visualizationConfiguration);
  }
}

main();
```
<!--
# TODO uncomment when plugins are officially documented
> If you are writing a Linkurious plugin, the Linkurious Rest-Client library will be already initialized.
-->

You can use any other Ogma feature you would like to apply to the visualization.
  
> To learn more about Ogma check our [official documentation](https://doc.linkurio.us/ogma/latest/).
  
## Licensing
The Ogma-Linkurious parser is licensed under the Apache License, Version 2.0. See [LICENSE](/LICENSE) for the full license text.
