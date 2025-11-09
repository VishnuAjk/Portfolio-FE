import PropTypes from 'prop-types';
import { AuthProvider } from '../../contexts/AuthContext.jsx';
import { PortfolioProvider } from '../../contexts/PortfolioContext.jsx';
import { ConfirmationProvider } from '../../contexts/ConfirmationContext.jsx';

const AppProviders = ({ children }) => (
  <AuthProvider>
    <PortfolioProvider>
      <ConfirmationProvider>{children}</ConfirmationProvider>
    </PortfolioProvider>
  </AuthProvider>
);

AppProviders.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppProviders;
