# YAML-to-RAML
This project merges YAML files and converts them to RAML.

1. Check for each YAML files for basePath and pathNames and maintain a record.
2. Based on the record it merges YAML files.
3. Reads merged YAML into an object and copy description in method level and puts it under API level.
4. Convert the object into RAML.

This project uses merge-yaml-cli and oas-raml-converter.
