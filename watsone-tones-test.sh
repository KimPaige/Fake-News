KEY=`cat .key`
echo $KEY
curl -X GET --user "apikey:${KEY}" \
"https://gateway-syd.watsonplatform.net/tone-analyzer/api/v3/tone?version=2016-05-19&text=Awww+big%2C+tough%2C+hardened+Mongrel+Mob+members+feeling+like+they%27ve+been+picked+on.++Define+irony+..." | python -m json.tool