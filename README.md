# Fidelisa mobile app

```shell
npm install
gulp install
ionic serve
```


# To use gulp download-config create a file ./options.json

```json
{
  "fidelisa_host": "https://api.fidelisa.com",
  "appId" : "<app_id>",
  "provider": "<provider>",
  "provider_key": "<provider_key"
}
```

# To build selector

```shell
cd src/addons/selector
gulp build
cp dist/fidelisa-selector.bundle.min.js ../../../www/lib
```

Refresh page
