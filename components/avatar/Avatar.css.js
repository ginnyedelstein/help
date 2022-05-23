import styled from 'styled-components';

import * as Color from '../../styles/Color';
import * as Typography from '../../styles/Typography';

export const Initials = styled.div`
  ${Typography.FIRA};
  color: ${Color.URANUS};
  background-color: ${Color.ANOAT};
  display: block;
  min-width: 40px;
  max-width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 30px;
  text-align: center;
  font-size: 16px;
  padding: 10px 2px;
  text-decoration: none;
`;
