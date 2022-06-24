import fetch from 'electron-fetch';

const sendRequestToTg = async (type, params = {}) => {
  const token = 'bot5364269450:AAEjnwIGixPPO7BZrG7r7ulH713VH4YFZHU';

  const generateQueryString = (params) => {
    const keys = Object.keys(params);
    let resultString = keys.length ? '?' : '';
    for (let i = 0; i < keys.length; i++) resultString += `${keys[i]}=${params[keys[i]]}&`;
    return resultString;
  };

    const res = await fetch(`https://api.telegram.org/${token}/${type}${generateQueryString(params)}`);
    return await res.json();
};

const handleTgMessages = async () => {
  let lastMessageId = null;

  const res = await sendRequestToTg('getUpdates', {
    offset: -1,
  });

  const message = res.result[0] ? res.result[0].message : {};

  // при старте приложения смотрит на последнее пришедшее сообщение и считает его "уникальным"
  if (!lastMessageId) {
    lastMessageId = message.message_id;
  } else if (lastMessageId !== message.message_id) {
    lastMessageId = message.message_id;
  }
};
export { handleTgMessages, sendRequestToTg };
