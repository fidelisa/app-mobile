# mobile2

1/ npm install

2/ gulp install

3/ ionic serve



# pour utliser gulp download-config créer un fichiers

./options.json
ex:
```json
{
  "fidelisa_host": "https://api.fidelisa.com",
  "appId" : "1FB432922E1E4EA195C8F54822D24EA1",
  "provider": "<provider>",
  "provider_key": "<provider_key"
}
```

# Pour compiler le selector

```shell
cd src/addons/selector
gulp build
cp dist/fidelisa-selector.bundle.min.js ../../../www/lib
```

Rafraichir la page
