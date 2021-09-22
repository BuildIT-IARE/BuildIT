import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

// Ace imports
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/ext-language_tools";
// Languages
import "ace-builds/src-noconflict/mode-python";
// Themes
import "ace-builds/src-noconflict/theme-dracula";

import {
  Container,
  RowContainer,
  ColContainer,
  LangContainer,
} from "./display-question.styles";

import Page from "../page/page.component";
import Title from "../custom-title/custom-title.component";
import BackArrow from "../back-arrow/back-arrow.component";
import Spinner from "../spinner/spinner.component";
import CustomInput from "../custom-input/custom-input.component";
import CustomButton from "../custom-button/custom-button.component";

import { selectCurrentUserToken } from "../../redux/user/user.selector";
import { getQuestionWithId } from "../../utils/query";
import { runCode } from "../../utils/ide";

const DisplayQuestions = ({ match: { params }, history, token }) => {
  const onCodeChange = (newValue) => {
    setState({ ...state, code: newValue });
  };

  const onInputChange = (e) => {
    const { value } = e.target;
    setState({ ...state, input: value });
  };

  const onLanguageChange = (e) => {
    const { value, mode } = e.target;
    setState({ ...state, language: value, mode });
  };

  const onRun = async (state, token) => {
    runCode(state, token, (response, err) => {
      if (err) {
        alert(err);
      } else {
        console.log(response);
      }
    });
  };
  const onSubmit = () => {};

  const { questionId } = params;

  const [state, setState] = useState({
    loading: true,
    code: "",
    language: "34",
    input: "",
    output: "",
    mode: "python",
  });

  useEffect(() => {
    async function getQuestion(questionId, token) {
      const { data } = await getQuestionWithId(questionId, token);
      setState((state) => ({ ...state, loading: false, question: data[0] }));
    }
    getQuestion(questionId, token);
  }, [questionId, token]);

  if (state.loading) return <Spinner />;

  const { question, input, output, mode, code } = state;
  const {
    questionName,
    questionDescriptionText,
    questionInputText,
    questionOutputText,
  } = question;

  return (
    <Page>
      <Container>
        <BackArrow history={history} />
        <Title>{questionName}</Title>
        <span>{questionDescriptionText}</span>
        <h3>Input</h3>
        <span>{questionInputText}</span>
        <h3>Output</h3>
        <span>{questionOutputText}</span>
        {question.questionExampleInput1 ? (
          <div>
            <h3>Example Input 1</h3>
            <code>{question.questionExampleInput1}</code>
            <h3>Example Output 1</h3>
            <code>{question.questionExampleOutput1}</code>
          </div>
        ) : null}
        {question.questionExampleInput2 ? (
          <div>
            <h3>Example Input 2</h3>
            <code>{question.questionExampleInput2}</code>
            <h3>Example Output 2</h3>
            <code>{question.questionExampleOutput2}</code>
          </div>
        ) : null}
        {question.questionExampleInput3 ? (
          <div>
            <h3>Example Input 3</h3>
            <code>{question.questionExampleInput3}</code>
            <h3>Example Output 3</h3>
            <code>{question.questionExampleOutput3}</code>
          </div>
        ) : null}
        {question.questionExplanation ? (
          <div>
            <h3>Explanation</h3>
            <span>{question.questionExplanation}</span>
          </div>
        ) : null}
        <LangContainer>
          <h3>Language</h3>
          <CustomInput as="select" onChange={onLanguageChange} value="34">
            <option value="1" mode="shell">
              Bash (4.4)
            </option>
            <option value="3" mode="text/x-pascal">
              Basic (fbc 1.05.0)
            </option>
            <option value="4" mode="c">
              C (gcc 7.2.0)
            </option>
            <option value="10" mode="cpp">
              C++ (g++ 7.2.0)
            </option>
            <option value="16" mode="csharp">
              C# (mono 5.4.0.167)
            </option>
            <option value="18" mode="clojure">
              Clojure (1.8.0)
            </option>
            <option value="19" mode="text/x-crystal">
              Crystal (0.23.1)
            </option>
            <option value="20" mode="text/x-elixir">
              Elixir (1.5.1)
            </option>
            <option value="21" mode="text/x-erlang">
              Erlang (OTP 20.0)
            </option>
            <option value="22" mode="go">
              Go (1.9)
            </option>
            <option value="23" mode="text/x-haskell">
              Haskell (ghc 8.2.1)
            </option>
            <option value="25" mode="plaintext">
              Insect (5.0.0)
            </option>
            <option value="26" mode="java">
              Java (OpenJDK 9 with Eclipse OpenJ9)
            </option>
            <option value="27" mode="java">
              Java (OpenJDK 8)
            </option>
            <option value="28" mode="java">
              Java (OpenJDK 7)
            </option>
            <option value="29" mode="javascript">
              JavaScript (nodejs 8.5.0)
            </option>
            <option value="31" mode="text/x-ocaml">
              OCaml (4.05.0)
            </option>
            <option value="32" mode="text/x-octave">
              Octave (4.2.0)
            </option>
            <option value="33" mode="pascal">
              Pascal (fpc 3.0.0)
            </option>
            <option value="34" mode="python">
              Python (3.6.0)
            </option>
            <option value="36" mode="python">
              Python (2.7.9)
            </option>
            <option value="38" mode="ruby">
              Ruby (2.4.0)
            </option>
            <option value="42" mode="rust">
              Rust (1.20.0)
            </option>
            <option value="43" mode="plaintext">
              Text (plain text)
            </option>
            <option value="44" mode="plaintext">
              Executable
            </option>
          </CustomInput>
        </LangContainer>
        <AceEditor
          mode={mode}
          theme="dracula"
          onChange={onCodeChange}
          width="63vw"
          height="70vh"
          fontSize="20px"
          name="ace-editor"
          value={code}
          editorProps={{ $blockScrolling: true }}
          enableLiveAutocompletion={true}
        />
        <RowContainer style={{ justifyContent: "right" }}>
          <CustomButton onClick={() => onRun(state, token)}>RUN</CustomButton>
          <CustomButton onClick={() => onSubmit(state, token)}>
            Submit
          </CustomButton>
        </RowContainer>
        <RowContainer>
          <ColContainer>
            <h3>Input</h3>
            <textarea
              rows="5"
              cols="50"
              value={input}
              onChange={onInputChange}
            ></textarea>
          </ColContainer>
          <ColContainer>
            <h3>Output</h3>
            <textarea rows="5" cols="50" value={output} readOnly></textarea>
          </ColContainer>
        </RowContainer>
      </Container>
    </Page>
  );
};

const mapStateToProps = createStructuredSelector({
  token: selectCurrentUserToken,
});

export default connect(mapStateToProps)(DisplayQuestions);
