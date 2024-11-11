import React from 'react';
import ProtectedContent from '../Auth/ProtectedContent';
import LogoutButton from '../Auth/LogoutButton';

function UserActions({ token, onLogout }) {
  return (
    <div>
      <h3>Akcje dostępne po zalogowaniu</h3>
      <ProtectedContent token={token} />
      <LogoutButton onLogout={onLogout} />
    </div>
  );
}

export default UserActions;
