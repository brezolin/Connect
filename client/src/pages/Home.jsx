import React from 'react';
import { useNavigate } from 'react-router-dom';
import Feed from '../components/Feed';
import './Home.css'
import UpcomingReleases from '../components/UpcomingReleases';

const Home = () => {
 
  
  return (
    <div >
      <UpcomingReleases/>
     <Feed />
    </div>
  );
};





export default Home;
