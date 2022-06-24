import { sendRequestToTg } from './telegram';
import fetch from 'electron-fetch'

const getCastLotsJoke = async () => {
  const req = await fetch(
    'https://castlots.org/generator-anekdotov-online/generate.php',
    {
      headers: {
        accept: 'application/json',
        'x-requested-with': 'XMLHttpRequest',
      },
      method: 'POST',
    }
  )

  const responseText = await req.text();
  if (!req.ok) return `castlots request is not ok. Response: ${responseText}`;

  try {
    const responseJoke = JSON.parse(responseText).va;
    if (typeof responseJoke !== 'string') return `joke is not a string. ${typeof responseJoke} received instead. data: ${responseJoke}`;
    return responseJoke;
  } catch (e) {
    return `${String(e)} Ашибка`;
  }
};

const myId = 746009942;

export const sendJoke = async () => {
  const joke = await getCastLotsJoke();
  console.log('try to send joke');
  await sendRequestToTg('sendMessage', {
    chat_id: myId,
    text: joke,
  });
};

