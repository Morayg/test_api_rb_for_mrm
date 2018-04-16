//подключаем зависимости
var request = require('request');
var jwt = require('jsonwebtoken');
var fs = require('fs');

//создаем дату окончания токена, текущую дату в соответствии с требованиями, получаем секрет из файла key.txt
var token_expiration_timestamp = new Date('2018-05-15').getTime();
var date_now =  new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
var secret;
try {  
    secret = fs.readFileSync('key.txt', 'utf8');
    //console.log(secret);    
} catch(e) {
    console.log('Error:', e.stack);
};

//Создаем токен, передаем в него секрет, ТН обучающегося и роль
var token = jwt.sign({
    iss: 'auth.sberbank-school.ru',
    aud: ['default', 'auth', 'default'],
    validTill: token_expiration_timestamp,
    tableNum: '00000000',
    role: 'rb'
}, secret, {algorithm: 'HS512'});

//Указываем ENDPOINT, и параметры необходимые для метода
var options = {
    url: 'https://api.stage.sberbank-school.ru/v2/mrm/mobile/log/videonews/view',
    headers: {Authorization: 'Bearer ' + token},
    preambleCRLF: true,
    postambleCRLF: true,
    json: {
	startEventDatetime: date_now,
	endEventDatetime: date_now,
	tableNum: 'Не используется',
	eventObjectId: 1
    }
};

//отправляем запрос и выводим ответ в консоль
request.post(options)
    .pipe(process.stdout);
