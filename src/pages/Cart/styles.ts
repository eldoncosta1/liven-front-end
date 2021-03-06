import styled from 'styled-components';
import { darken, lighten } from 'polished';

export const Container = styled.div`
  padding: 30px;
  background: var(--white);
  border-radius: 4px;

  footer {
    margin-top: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    button {
      background: var(--blue);
      color: var(--green);
      border: 0;
      border-radius: 4px;
      padding: 12px 20px;
      font-weight: bold;
      text-transform: uppercase;
      transition: background 0.2s;

      &:hover {
        background: ${lighten(0.1, 'rgb(8, 1, 42)')};
      }
    }
  }
`;

export const Total = styled.div`
  display: flex;
  align-items: baseline;

  span {
    color: var(--gray);
    font-weight: bold;
  }

  strong {
    font-size: 28px;
    margin-left: 5px;
  }
`;

export const ProductTable = styled.table`
  width: 100%;

  thead th {
    color: var(--gray);
    text-align: left;
    padding: 12px;
  }

  tbody td {
    padding: 12px;
    border-bottom: 1px solid var(--white-50);
  }

  img {
    height: 100px;
  }

  strong {
    color: var(--gray-500);
  }

  span {
    display: block;
    margin-top: 5px;
    font-size: 18px;
    font-weight: bold;
  }

  div {
    display: flex;
    align-items: center;

    input {
      border: 1px solid #ddd;
      border-radius: 4px;
      color: var(--gray-100);
      padding: 6px;
      width: 50px;
    }
  }

  button {
    background: none;
    border: 0;
    padding: 6px;

    svg {
      color: var(--blue);
      transition: color 0.2;
    }

    &:hover {
      svg {
        color: ${lighten(0.3, 'rgb(8, 1, 42)')};
      }
    }

    &:disabled {
      svg {
        color: ${lighten(0.25, 'rgb(8, 1, 42)')};
        cursor: not-allowed;
      }
    }
  }
`;
