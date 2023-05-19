# Ogma-Linkurious Parser 

## Description
Ogma-Linkurious Parser is an official library maintained by the Linkurious team that allows you to quickly parse and load a Linkurious visualization in Ogma with one line of code and apply different Linkurious Enterprise styles, filters, captions and more.

### Prerequisites
- Linkurious Enterprise 2.10.x or above
- An existing visualization to export 
- An Ogma license

# Installation

````npm install @linkurious/ogma-linkurious-parser````

# Usage

In order to create an Ogma visualization with your Linkurious styles:

1. Get your visualization using [Linkurios REST API](https://doc.linkurio.us/server-sdk/latest/apidoc/#api-Visualization-getVisualization).

2. Get Linkurious configuration using [Linkurios REST API](https://doc.linkurio.us/server-sdk/latest/apidoc/#api-Config-getConfiguration).

3. If you need to reproduce the same caption styles, get graph schema using [Linkurios REST API](https://doc.linkurious.com/server-sdk/latest/apidoc/#api-Schema-getTypes).

4. Initialize `LKOgma` and call `initVisualization` with the configuration and the visualization data from the previous steps.


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


  const nodeTypesResponse = await this.rc.graphSchema.getTypesWithAccess({
    entityType: 'node'
  });
  const edgeTypesResponse = await this.rc.graphSchema.getTypesWithAccess({
    entityType: 'edge'
  });
  

  if (linkuriousConfigurationResponse.isSuccess() && visualizationResponse.isSuccess() && nodeTypesResponse.isSuccess() && edgeTypesResponse.isSuccess) {
    
      const ogmaConfiguration = linkuriousConfigurationResponse.body.ogma;
      
      const graphSchema = {
        node: nodeTypesResponse.body.node.results,
        edge: edgeTypesResponse.body.edge.results
      }
      
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

      // Set graphSchema that will be used in defining caption styles
      ogma.LKCaptions.graphSchema = graphSchema;
      
      // Initialize the visualization content & styles
      await ogma.initVisualization(visualizationConfiguration);

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
