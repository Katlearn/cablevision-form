import React, { useState, useRef } from "react";
import SignaturePad from "react-signature-canvas";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import "./ApplicationForm.css"; // optional for styling
import emailjs from "emailjs-com";

export default function ApplicationForm() {
  const sigCanvas = useRef({});
  const [markerPosition, setMarkerPosition] = useState({ lat: 14.5995, lng: 120.9842 }); // Default: Manila
  const [formData, setFormData] = useState({});

  const clearSignature = () => {
    sigCanvas.current.clear();
  };

  const handleMarkerDragEnd = (e) => {
    setMarkerPosition({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const signatureData = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png");

    // Combine all data
    const fullData = {
      ...formData,
      markerLat: markerPosition.lat,
      markerLng: markerPosition.lng,
      signature: signatureData
    };

    // Send via EmailJS
    emailjs
      .send(
        "YOUR_SERVICE_ID", // Replace with your EmailJS service ID
        "YOUR_TEMPLATE_ID", // Replace with your EmailJS template ID
        fullData,
        "YOUR_PUBLIC_KEY" // Replace with your EmailJS public key
      )
      .then(
        (result) => {
          console.log("Email successfully sent!", result.text);
          alert("Form submitted and email sent!");
        },
        (error) => {
          console.error("Error sending email:", error);
          alert("Failed to send email. Please try again.");
        }
      );
  };


  return (
    <form className="application-form" onSubmit={handleSubmit}>
      {/* Logo section */}
      <div className="logo-container">
        <img src="/logo.jpg" alt="Company Logo" className="company-logo" />
      </div>
      <h2>CABLEVISION SYSTEMS CORPORATION</h2>
      <h2>Application Form</h2>
      <p>Kindly fill up this form and we'll get back to you as soon as possible.</p>

      <label>Date *</label>
      <input type="date" name="date" onChange={handleChange} required />

      <label>Name *</label>
      <div className="row">
        <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required />
        <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} required />
      </div>

      <label>Address *</label>
      <input type="text" name="address" placeholder="Street Address" onChange={handleChange} required />

      <label>Landmark *</label>
      <input type="text" name="address" placeholder="Landmark" onChange={handleChange} required />


      <label>Resident Type *</label>
      <div className="row">
        <label><input type="radio" name="residentType" value="Renter" onChange={handleChange} /> Renter</label>
        <label><input type="radio" name="residentType" value="Owner" onChange={handleChange} /> Owner</label>
      </div>

      <label>Email *</label>
      <input type="email" name="email" placeholder="you@example.com" onChange={handleChange} required />

      <label>Phone Number 1 *</label>
      <input type="tel" name="phone1" placeholder="(000) 000-0000" onChange={handleChange} required />

      <label>Phone Number 2</label>
      <input type="tel" name="phone2" placeholder="(000) 000-0000" onChange={handleChange} />

      <label>Location (Pin Your Address) *</label>
      <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "300px" }}
          center={markerPosition}
          zoom={15}
        >
          <Marker
            position={markerPosition}
            draggable={true}
            onDragEnd={handleMarkerDragEnd}
          />
        </GoogleMap>
      </LoadScript>

      <label>Proof of Billing *</label>
      <input type="file" name="proofBilling" required />

      <label>Valid ID *</label>
      <input type="file" name="validId" required />

      <label>Existing Internet Provider *</label>
      <input type="text" name="provider" onChange={handleChange} required />

      <label>Existing Plan Description *</label>
      <input type="text" name="planDescription" onChange={handleChange} required />

      <label>Requested Package *</label>
      <div>
        <label><input type="radio" name="package" value="300" onChange={handleChange} /> Up to 300 Mbps + FREE Digital TV - ₱1260.00</label>
        <label><input type="radio" name="package" value="500" onChange={handleChange} /> Up to 500 Mbps + FREE Digital TV - ₱1600.00</label>
        <label><input type="radio" name="package" value="800" onChange={handleChange} /> Up to 800 Mbps + FREE Digital TV - ₱2100.00</label>
      </div>

      <label>How did you know about us? *</label>
      <div>
        {["Facebook", "Sales Agent", "Flyers", "Tarpaulin", "Referrals"].map((item) => (
          <label key={item}><input type="checkbox" name="howKnow" value={item} onChange={handleChange} /> {item}</label>
        ))}
      </div>

      <label>Name of Sales Agent *</label>
      <input type="text" name="salesAgent" onChange={handleChange} required />

      <label>Name of Contact Person *</label>
      <input type="text" name="contactPerson" onChange={handleChange} required />



      <label>Digital Signature *</label>
      <div className="signature-box">
        <SignaturePad
          ref={sigCanvas}
          penColor="black"
          canvasProps={{
            width: 400,
            height: 200,
            className: "sigCanvas"
          }}
        />
        <button type="button" onClick={clearSignature}>Clear</button>
      </div>

      <button type="submit" className="submit-btn">Submit</button>
    </form>
  );
}
