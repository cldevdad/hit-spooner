import styled from "@emotion/styled";
import { Badge, Modal, Table, Title } from "@mantine/core";
import { themedModalStyles } from "./styleConstants";
import { Theme } from "@emotion/react";

/**
 * Styled Modal component using Mantine's Modal with custom styling.
 */
export const StyledModal = styled(Modal)`
  z-index: 5000;
  ${({ theme }) => themedModalStyles(theme)};
`;

/**
 * Styled Alert component using Mantine's Modal with custom styling.
 */
export const StyledAlert = styled(Modal)`
  z-index: 9999;
  ${({ theme }) => themedModalStyles(theme)};
`;

export const StyledTitle = styled(Title)`
  margin-bottom: ${(props) => props.theme.spacing.xxs};
  color: ${(props) => props.theme.colors.primary[7]};
  font-size: 13px;
`;

export const StyledTable = styled(Table)`
  width: 100%;
`;

export const StyledTableHeaderRow = styled.tr`
  background-color: ${(props) => props.theme.colors.primary[2]};
`;

export const StyledTableHeader = styled.th`
  color: ${(props) => props.theme.colors.primary[9]};
  padding: ${(props) => props.theme.spacing.xs};
  text-align: left;
`;

export const StyledTableRow = styled.tr`
  background-color: ${(props) => props.theme.colors.primary[0]};
  &:nth-of-type(even) {
    background-color: ${(props) => props.theme.colors.primary[1]};
  }
  &:hover {
    background-color: ${(props) => props.theme.colors.primary[3]};
    cursor: pointer;
  }
`;

export const StyledTableCell = styled.td`
  padding: ${(props) => props.theme.spacing.xs};
  border-bottom: 1px solid ${(props) => props.theme.colors.primary[3]};
`;
