import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  white-space: pre-wrap;
  width: 80%;

  h3 {
    color: black;
    user-select: none;
  }

  span {
    user-select: none;
  }

  #ace-editor {
  }

  textarea {
    width: 100%;
    font-size: 20px;
    border: 2px solid grey;
    padding: 5px;
  }
`;

export const ColContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 45%;
`;

export const RowContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px 0px;
  margin: 10px 0px;
  justify-content: space-between;
`;

export const LangContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 10px 0px;
  margin: 10px 0px;
`;
