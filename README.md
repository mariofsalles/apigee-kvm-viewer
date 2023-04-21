# apigee-kvm-viewer

This is a very simple graphic tool, developed to simplify the visualization and management of Apigee X KVMs.

## Usage
1. Install the dependencies
```
npm install
```
2. Set your project information on ***/src/config.json***
```
{
    "ORG": "your-apigee-org",
    "ENVS": ["eval"],
    "TOKEN": "YOUR_GCP_TOKEN"
}
```
3. Finally, run the 'start' command
```
npm start 
```
Now you should be able to use the graphic interface for kvms.
