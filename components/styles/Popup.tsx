import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import ReportForm from '../ui/petition/create-post';

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(1.5px);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PopupCard = styled.div`
  position: relative;
  background-color: black;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 16px;
  animation: ${fadeIn} 0.3s ease-out;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 50px;
  background: none;
  border: none;
  font-size: 32px; /* Keeps the font size */
  color: white;
  cursor: pointer;
  z-index: 1000;
  border-radius: 50%; /* Makes the button round */
  width: 50px; /* Set a fixed width */
  height: 50px; /* Set a fixed height to match width */
  display: flex; /* Use flex to center content */
  align-items: center; /* Center vertically */
  justify-content: center; /* Center horizontally */

  &:hover {
    background-color: purple; 
  }
`;

type PopupProps = {
    togglePopup: (event: React.MouseEvent<HTMLElement>) => void;
};

export const Popup: React.FC<PopupProps> = ({ togglePopup }) => {
    return (
        <Overlay>
            <PopupCard>
                <CloseButton onClick={togglePopup}>&times;</CloseButton>
                <ReportForm />
            </PopupCard>
        </Overlay>
    );
};