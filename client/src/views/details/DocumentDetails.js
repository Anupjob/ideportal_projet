import React from 'react'
import {
  CCol,
  CProgress,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import SplitPane, { Pane } from 'react-split-pane';
import './document.css';


class DocumentDetails extends React.Component {

    render() {

        // console.log("this.state", this.state);
      return (
        <CRow>    
        <SplitPane
        split="horizontal"
        minSize={50}
        defaultSize={parseInt(localStorage.getItem('splitPos'), 10)}
        onChange={(size) => localStorage.setItem('splitPos', size)}
        >
        <div style={{padding:20}}>
        Nothing compares to nature‘s beauty, as these famous quotes about nature agree. From spring‘s hopeful new blooms and fall’s exquisite array of colors to winter’s magic and summer’s energy, each season abounds with different types of natural beauty to explore and admire. For those who may forget what being in nature feels like—this is where these best nature quotes come in!
        From enchanting nature’s beauty quotes that evoke visions of lush meadows full of brilliantly-colored flowers or dense forests with sky-high trees to famous quotes about nature’s ever-present—and absolutely fundamental—role in our lives, these 101 quotes about nature will have you itching to get off your couch and get outside. For famous quotes about nature, we have them here!
        So whether you keep it simple and kick back in your backyard with your immediate family or you do something a bit more adventurous, like hitting the local trails for a socially distant hike with your pup, take a moment to get outdoors and appreciate the world’s natural wonders, since spending a little bit of time in nature is like chicken soup for the soul—and we could all use a little more of that right now.
        </div>
        <div style={{backgroundColor:'#fff',padding:20}}>
        Nothing compares to nature‘s beauty, as these famous quotes about nature agree. From spring‘s hopeful new blooms and fall’s exquisite array of colors to winter’s magic and summer’s energy, each season abounds with different types of natural beauty to explore and admire. For those who may forget what being in nature feels like—this is where these best nature quotes come in!
        From enchanting nature’s beauty quotes that evoke visions of lush meadows full of brilliantly-colored flowers or dense forests with sky-high trees to famous quotes about nature’s ever-present—and absolutely fundamental—role in our lives, these 101 quotes about nature will have you itching to get off your couch and get outside. For famous quotes about nature, we have them here!
        So whether you keep it simple and kick back in your backyard with your immediate family or you do something a bit more adventurous, like hitting the local trails for a socially distant hike with your pup, take a moment to get outdoors and appreciate the world’s natural wonders, since spending a little bit of time in nature is like chicken soup for the soul—and we could all use a little more of that right now.
        </div>
        </SplitPane>
        </CRow>
        );
   }
}
export default DocumentDetails
