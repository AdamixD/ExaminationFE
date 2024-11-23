import React from 'react';
import ProtectedContent from '../Auth/ProtectedContent';

function UserActions({ token, onLogout }) {
  return (
    <div>
      <h3>Akcje dostępne po zalogowaniu</h3>
      <ProtectedContent token={token} />
    </div>
  );
}

export default UserActions;
