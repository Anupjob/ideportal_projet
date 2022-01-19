import React from "react";
import {
  CBadge,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CImg,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { useHistory } from "react-router";
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const userText = {
  color: "#fff",
  fontSize: "1.2em",
  marginRight: "20px",
  whiteSpace: "nowrap"
}
const userTextbottom = {
  display: "block",
  color: "rgb(143, 222, 253)",
  textTransform: "uppercase",
  fontSize: "0.8em",
  textAlign: "center",
  fontWeight: "bold"
}

const TheHeaderDropdown = () => {
  const history = useHistory();
  return (
    <CDropdown inNav className="c-header-nav-items mx-3" direction="down">
      <CDropdownToggle className="c-header-nav-link" caret={false}>
        <div style={userText}>{localStorage.getItem('name')} <span style={userTextbottom}>{localStorage.getItem('company')}</span></div>
        <div className="c-avatar">
          <CImg
            src={"avatars/6.jpg"}
            className="c-avatar-img"
            alt="admin@bootstrapmaster.com"
            style={{ width: "50px", height: "50px" }}
          />
        </div>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        {/* <CDropdownItem header tag="div" color="light" className="text-center">
          <strong>Account</strong>
        </CDropdownItem>
        <CDropdownItem>
          <CIcon name="cil-bell" className="mfe-2" />
          Updates
          <CBadge color="info" className="mfs-auto">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem>
          <CIcon name="cil-envelope-open" className="mfe-2" />
          Messages
          <CBadge color="success" className="mfs-auto">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem>
          <CIcon name="cil-task" className="mfe-2" />
          Tasks
          <CBadge color="danger" className="mfs-auto">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem>
          <CIcon name="cil-comment-square" className="mfe-2" />
          Comments
          <CBadge color="warning" className="mfs-auto">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem header tag="div" color="light" className="text-center">
          <strong>Settings</strong>
        </CDropdownItem>
        <CDropdownItem>
          <CIcon name="cil-user" className="mfe-2" />
          Profile
        </CDropdownItem> */}
        {/* <CDropdownItem>
          <CIcon name="cil-settings" className="mfe-2" />
          Settings
        </CDropdownItem> */}
        {/* <CDropdownItem>
          <CIcon name="cil-credit-card" className="mfe-2" />
          Payments
          <CBadge color="secondary" className="mfs-auto">
            42
          </CBadge>
        </CDropdownItem> */}
        {/* <CDropdownItem>
          <CIcon name="cil-file" className="mfe-2" />
          Projects
          <CBadge color="primary" className="mfs-auto">
            42
          </CBadge>
        </CDropdownItem> */}
        <CDropdownItem divider />
        <CDropdownItem
          onClick={() => {
            // firebase.auth().signOut();
            // history.push("/");
            console.log('handleLogout', history);
            localStorage.clear();
            history.push("/");

          }}
        >
          <CIcon name="cil-lock-locked" className="mfe-2" />
          {/* Lock Account */}
          Sign Out
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default TheHeaderDropdown;
