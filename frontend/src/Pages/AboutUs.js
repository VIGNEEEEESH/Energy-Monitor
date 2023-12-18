import React from 'react';
import './AboutUs.css'; // Import your CSS file for styling
import { Carousel } from 'antd';


function AboutUs() {
  return (
    <div className="AboutUs">
      <div className="AboutUs1">
      <div className="about-us-container">
        <div className="about-us-content">
          <div className="content-text">
            <h1>About Our Company</h1>
            <p>
              Welcome to Smart Energy Monitoring System, where we are committed to
              revolutionizing the way people manage and conserve energy. Our mission
              is to provide smart and efficient solutions that empower individuals
              and businesses to monitor, control, and optimize their energy usage.
            </p>
            <p>
              We believe in sustainability, innovation, and the power of data to
              drive informed decisions. With our cutting-edge technology, we aim to
              reduce carbon footprints and promote a greener, more sustainable
              future.
            </p>
          </div>
          <div className="content-image">
            <img src="/logo.png" alt="Company Image" />
          </div>
        </div>
      </div>
      <div className='H-container'>
        <div className='Heading'>Mission and Vision</div>
      </div>
      <div className="carousel-container">
        <Carousel showThumbs={false} showStatus={false}>
          <div className='c-text'>
            <div>
              <p>
                Our Vision and Mission:
                At Smart Energy Monitoring System, our vision is to lead the way in transforming the energy landscape.
                We are on a mission to empower individuals and businesses by providing innovative and efficient solutions to monitor,
                manage, and optimize their energy consumption. We believe that sustainability,
                driven by cutting-edge technology and data-driven insights, is the key to a greener and more sustainable future.
              </p>
            </div>
            
          </div>
          <p>
                Our Vision and Mission:
                At Smart Energy Monitoring System, our vision is to lead the way in transforming the energy landscape.
                We are on a mission to empower individuals and businesses by providing innovative and efficient solutions to monitor,
                manage, and optimize their energy consumption. We believe that sustainability, driven by cutting-edge technology and data-driven insights, is the key to a greener and more sustainable future.
              </p>
              <p>
                Our Vision and Mission:
                At Smart Energy Monitoring System, our vision is to lead the way in transforming the energy landscape.
                We are on a mission to empower individuals and businesses by providing innovative and efficient solutions to monitor,
                manage, and optimize their energy consumption. We believe that sustainability, driven by cutting-edge technology and data-driven insights, is the key to a greener and more sustainable future.
              </p>
          {/* Add more carousel items as needed */}
        </Carousel>
      </div>

      {/* Second Heading and Carousel */}
      <div className='H-container1'>
        <div className='Heading'>Our Commitment</div>
      </div>
      <div className="carousel-container">
        <Carousel showThumbs={false} showStatus={false}>
          <div className='c-text'>
            <div>
              <p>
                
                Sustainability is at the core of everything we do. We are committed to reducing carbon footprints and promoting ecofriendly practices. Through our smart energy monitoring solutions,
                we enable our users to make informed decisions about their energy usage, leading to less environmental impact.
                Our dedication to sustainability is not just a commitment, it's a responsibility we take seriously.
              </p>
            </div>
          </div>
          <p>
                Sustainability is at the core of everything we do. We are committed to reducing carbon footprints and promoting eco-friendly practices. Through our smart energy monitoring solutions,
                we enable our users to make informed decisions about their energy usage, leading to reduced environmental impact.
                Our dedication to sustainability is not just a commitment; it's a responsibility we take seriously.
              </p>
              <p>
                
                Sustainability is at the core of everything we do. We are committed to reducing carbon footprints and promoting eco-friendly practices. Through our smart energy monitoring solutions,
                we enable our users to make informed decisions about their energy usage, leading to reduced environmental impact.
                Our dedication to sustainability is not just a commitment; it's a responsibility we take seriously.
              </p>
          {/* Add more carousel items as needed */}
        </Carousel>
      </div>
    </div>
    </div>
  );
}
export default AboutUs;