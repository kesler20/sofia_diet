import styled from "styled-components";

export const Heading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: var(--question-format);

  input {
    background: transparent;
    border: none;
    border-bottom: 1px solid black;
    outline: none;
    font-size: var(--input-font-size);
    margin 15px;
  }
`;
