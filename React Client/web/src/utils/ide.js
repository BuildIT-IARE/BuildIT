import axios from "axios";

export const runCode = (state, token, callback) => {
  const { input, language, code } = state;

  if (!code) {
    return callback(null, "Editor is empty!");
  }
  const data = {
    language_id: language,
    source_code: code,
    stdin: input,
  };
  return callback(
    axios({
      url:
        "http://13.234.234.30:3000/submissions?base64_encoded=false&wait=false",
      method: "post",
      headers: {
        Authorization: token,
      },
      data: data,
    }),
    null
  );
};
