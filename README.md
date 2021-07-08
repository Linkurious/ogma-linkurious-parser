# Ogma-Linkurious Helper 
TODO Discuss name with David

## Description
Ogma-Linkurious Helper is an official library maintained by the Linkurious team that allows you to generate Linkurious Enterprise similar looking visualizations by importing the data from Linkurious Enterprise and directly interacting with it via Ogma. 

Left: Ogma visualization without any style applied
Right: Linkurious Enterprise visualization using Ogma-Linkurious Helper
TODO add 2 screenshots same viz without styles and captions and one with everything

### Prerequisites
- Linkurious Enterprise 2.10.x or above
- An existing visualization to export 
- An Ogma license

# Installation

````npm install @linkurious/ogma-helper````

# Usage

- Retrieve your visualization data via an API call. You can do that via any of the following options:
  - A CURL request

TODO add curl example

  - Any HTTP client of your choice

TODO add postman example
        
  - The Linkurious Rest-Client library

TODO clean up example
```
    const rc = new RestClient({baseUrl: data.baseUrl});
    if (data.username !== undefined && data.password !== undefined) {
      await rc.auth.login({
        usernameOrEmail: data.username,
        password: data.password
      });
    }
    rc.visualization.getVisualization('{')
```
<!--
# TODO uncomment when plugins are officially documented
> If you are writing a Linkurious plugin, the Linkurious Rest-Client library will be already initialized.
-->

 - Import and initialize the Ogma-Linkurious helper in your project and call the `initVisualization` method in order to apply Linkurious styles and captions to your Ogma visualization 
   
TODO hello world of import/initialize

- Use any other Ogma feature you would like to apply to the visualization
  
> To learn more about Ogma check our [official documentation](https://doc.linkurio.us/ogma/latest/).
  
## Licensing
The Ogma-Linkurious helper is licensed under the Apache License, Version 2.0. See [LICENSE](/LICENSE) for the full license text.
