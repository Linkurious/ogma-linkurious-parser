# Ogma-Linkurious Parser 

## Description
Ogma-Linkurious Parser is an official library maintained by the Linkurious team that allows you to quickly parse and load a Linkurious visualization in Ogma with one line of code and apply different Linkurious Enterprise styles, filters, captions and more.  

Left: Ogma visualization without any style applied
Right: Linkurious Enterprise visualization using Ogma-Linkurious parser
TODO add 2 screenshots same viz without styles and captions and one with everything

### Prerequisites
- Linkurious Enterprise 2.10.x or above
- An existing visualization to export 
- An Ogma license

# Installation

````npm install @linkurious/ogma-parser````

# Usage

- Retrieve your visualization data via an API call. You can do that via any of the following options:
  - A CURL request: ````curl 'http://your-domain.com/api/{sourceKey}/visualizations/{visualizationId}'````
    
  - Any HTTP client of your choice: ````GET http://your-domain.com/api/{sourceKey}/visualizations/{visualizationId}````

Replace your-domain.com, {sourceKey} and {visualizationId} with the actual host and port of your server, your data source key and your visualization id respectively.

  - The Linkurious Rest-Client library
```
    // Initialize the rest client
    const rc = new RestClient({baseUrl: baseUrl});
    if (username !== undefined && password !== undefined) {
      await rc.auth.login({
        usernameOrEmail: username,
        password: password
      });
    }
    
    // Retrieve the visualization by id
    const viz = await rc.visualization.getVisualization({sourceKey:'e7900d9b', id: 3})
```
<!--
# TODO uncomment when plugins are officially documented
> If you are writing a Linkurious plugin, the Linkurious Rest-Client library will be already initialized.
-->

 - Import and initialize the Ogma-Linkurious parser in your project and call the `initVisualization` method in order to apply Linkurious styles and captions to your Ogma visualization 
   
```
import {LKOgma} from '@linkurious/ogma-helper';
import {RestClient} from "@linkurious/rest-client";

let ogma;

// Initialize the rest client
const rc = new RestClient({baseUrl: baseUrl});

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
     ogma = new LKOgma({
        ...ogmaConfiguration, options: {...ogmaConfiguration.options, backgroundColor: "rgba(240, 240, 240)"}
    });

    ogma.setContainer('graph-container');

    // Initialize the visualization content & styles
    ogma.initVisualization(visualizationConfiguration);
}

```

- Use any other Ogma feature you would like to apply to the visualization
  
> To learn more about Ogma check our [official documentation](https://doc.linkurio.us/ogma/latest/).
  
## Licensing
The Ogma-Linkurious parser is licensed under the Apache License, Version 2.0. See [LICENSE](/LICENSE) for the full license text.
