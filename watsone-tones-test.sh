KEY=`cat .key`
echo $KEY
curl -X GET --user "apikey:${KEY}" \
"https://gateway-syd.watsonplatform.net/tone-analyzer/api/v3/tone?version=2016-05-19&text=Always+tough+in+numbers%2Cweak+on+their+own" | python -m json.tool