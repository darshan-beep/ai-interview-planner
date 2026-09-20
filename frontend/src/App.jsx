import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './app.routes.jsx';
import { Authprovider } from './features/auth/auth.context.jsx';
import { InterviewProvider }from './features/interview/interview.context.jsx';

const App = () => {
  return (
    <Authprovider>
      <InterviewProvider>
        <RouterProvider router={router} />
      </InterviewProvider>
    </Authprovider>
  );
};

export default App;

