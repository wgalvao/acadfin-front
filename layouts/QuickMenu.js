// import node module libraries
import Link from "next/link";
import { Fragment } from "react";
import { useMediaQuery } from "react-responsive";
import { Row, Col, Image, Dropdown, ListGroup } from "react-bootstrap";

// simple bar scrolling used for notification item scrolling
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";

// import data files
import NotificationList from "data/Notification";

// import hooks
import useMounted from "hooks/useMounted";

// import { useLogOut } from "@/lib/auth";
import { useAuth, useAuthState } from "@/lib/auth";
import { useSession, signOut } from "next-auth/react";

import NextAuthProvider from "providers/Provider";
import { useRouter } from "next/navigation";

const QuickMenu = () => {
  const { data: session, status } = useSession({ required: true });
  const router = useRouter();

  const handleLogout = async () => {
    // Chama a função signOut do next-auth
    await signOut({ redirect: false });

    // Redireciona para a página inicial após o logout
    router.push("/auth/signin");
  };

  // const getUserDetails = async (useToken: boolean) => {
  //   try {
  //     const response = await axios({
  //       method: "get",
  //       url: process.env.NEXT_PUBLIC_BACKEND_URL + "auth/user/",
  //       headers: useToken ? {Authorization: "Bearer " + session?.access_token} : {},
  //     });
  //     setResponse(JSON.stringify(response.data));
  //   } catch (error) {
  //     setResponse(error.message);
  //   }
  // };

  const hasMounted = useMounted();
  const isDesktop = useMediaQuery({
    query: "(min-width: 1224px)",
  });

  const Notifications = () => {
    return (
      <SimpleBar style={{ maxHeight: "300px" }}>
        <ListGroup variant="flush">
          {NotificationList.map(function (item, index) {
            return (
              <ListGroup.Item
                className={index === 0 ? "bg-light" : ""}
                key={index}
              >
                <Row>
                  <Col>
                    <Link href="#" className="text-muted">
                      <h5 className=" mb-1">{item.sender}</h5>
                      <p className="mb-0"> {item.message}</p>
                    </Link>
                  </Col>
                </Row>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </SimpleBar>
    );
  };

  const QuickMenuDesktop = () => {
    return (
      <ListGroup
        as="ul"
        bsPrefix="navbar-nav"
        className="navbar-right-wrap ms-auto d-flex nav-top-wrap"
      >
        <Dropdown as="li" className="stopevent">
          <Dropdown.Toggle
            as="a"
            bsPrefix=" "
            id="dropdownNotification"
            className="btn btn-light btn-icon rounded-circle indicator indicator-primary text-muted"
          >
            <i className="fe fe-bell"></i>
          </Dropdown.Toggle>
          <Dropdown.Menu
            className="dashboard-dropdown notifications-dropdown dropdown-menu-lg dropdown-menu-end py-0"
            aria-labelledby="dropdownNotification"
            align="end"
            show
          >
            <Dropdown.Item className="mt-3" bsPrefix=" " as="div">
              <div className="border-bottom px-3 pt-0 pb-3 d-flex justify-content-between align-items-end">
                <span className="h4 mb-0">Notifications</span>
                <Link href="/" className="text-muted">
                  <span className="align-middle">
                    <i className="fe fe-settings me-1"></i>
                  </span>
                </Link>
              </div>
              <Notifications />
              <div className="border-top px-3 pt-3 pb-3">
                <Link
                  href="/dashboard/notification-history"
                  className="text-link fw-semi-bold"
                >
                  See all Notifications
                </Link>
              </div>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown as="li" className="ms-2">
          <Dropdown.Toggle
            as="a"
            bsPrefix=" "
            className="rounded-circle"
            id="dropdownUser"
          >
            <div className="avatar avatar-md avatar-indicators avatar-online">
              <Image
                alt="avatar"
                src="/images/avatar/avatar-1.jpg"
                className="rounded-circle"
              />
            </div>
          </Dropdown.Toggle>
          <Dropdown.Menu
            className="dropdown-menu dropdown-menu-end "
            align="end"
            aria-labelledby="dropdownUser"
            show
          >
            <Dropdown.Item as="div" className="px-4 pb-0 pt-2" bsPrefix=" ">
              <div className="lh-1 ">
                <h5 className="mb-1">{session?.user.username}</h5>
                <Link href="#" className="text-inherit fs-6">
                  View my profile
                </Link>
              </div>
              <div className=" dropdown-divider mt-3 mb-2"></div>
            </Dropdown.Item>
            <Dropdown.Item eventKey="2">
              <i className="fe fe-user me-2"></i> Edit Profile
            </Dropdown.Item>
            <Dropdown.Item eventKey="3">
              <i className="fe fe-activity me-2"></i> Activity Log
            </Dropdown.Item>
            <Dropdown.Item className="text-primary">
              <i className="fe fe-star me-2"></i> Go Pro
            </Dropdown.Item>
            <Dropdown.Item>
              <i className="fe fe-settings me-2"></i> Account Settings
            </Dropdown.Item>
            <Dropdown.Item onClick={handleLogout}>
              <i className="fe fe-power me-2"></i>Sign Out
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </ListGroup>
    );
  };

  const QuickMenuMobile = () => {
    return (
      <ListGroup
        as="ul"
        bsPrefix="navbar-nav"
        className="navbar-right-wrap ms-auto d-flex nav-top-wrap"
      >
        <Dropdown as="li" className="stopevent">
          <Dropdown.Toggle
            as="a"
            bsPrefix=" "
            id="dropdownNotification"
            className="btn btn-light btn-icon rounded-circle indicator indicator-primary text-muted"
          >
            <i className="fe fe-bell"></i>
          </Dropdown.Toggle>
          <Dropdown.Menu
            className="dashboard-dropdown notifications-dropdown dropdown-menu-lg dropdown-menu-end py-0"
            aria-labelledby="dropdownNotification"
            align="end"
          >
            <Dropdown.Item className="mt-3" bsPrefix=" " as="div">
              <div className="border-bottom px-3 pt-0 pb-3 d-flex justify-content-between align-items-end">
                <span className="h4 mb-0">Notifications</span>
                <Link href="/" className="text-muted">
                  <span className="align-middle">
                    <i className="fe fe-settings me-1"></i>
                  </span>
                </Link>
              </div>
              <Notifications />
              <div className="border-top px-3 pt-3 pb-3">
                <Link
                  href="/dashboard/notification-history"
                  className="text-link fw-semi-bold"
                >
                  See all Notifications
                </Link>
              </div>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown as="li" className="ms-2">
          <Dropdown.Toggle
            as="a"
            bsPrefix=" "
            className="rounded-circle"
            id="dropdownUser"
          >
            <div className="avatar avatar-md avatar-indicators avatar-online">
              <Image
                alt="avatar"
                src="/images/avatar/avatar-1.jpg"
                className="rounded-circle"
              />
            </div>
          </Dropdown.Toggle>
          <Dropdown.Menu
            className="dropdown-menu dropdown-menu-end "
            align="end"
            aria-labelledby="dropdownUser"
          >
            <Dropdown.Item as="div" className="px-4 pb-0 pt-2" bsPrefix=" ">
              <div className="lh-1 ">
                <h5 className="mb-1">{session?.user.username}</h5>
                <Link href="#" className="text-inherit fs-6">
                  View my profile
                </Link>
              </div>
              <div className=" dropdown-divider mt-3 mb-2"></div>
            </Dropdown.Item>
            <Dropdown.Item eventKey="2">
              <i className="fe fe-user me-2"></i> Edit Profile
            </Dropdown.Item>
            <Dropdown.Item eventKey="3">
              <i className="fe fe-activity me-2"></i> Activity Log
            </Dropdown.Item>
            <Dropdown.Item className="text-primary">
              <i className="fe fe-star me-2"></i> Go Pro
            </Dropdown.Item>
            <Dropdown.Item>
              <i className="fe fe-settings me-2"></i> Account Settings
            </Dropdown.Item>
            <Dropdown.Item
              //   onClick={() => signOut({ callbackUrl: "/", redirect: true })}
              onClick={handleLogout}
            >
              <i className="fe fe-power me-2"></i>Sign Out
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </ListGroup>
    );
  };

  return (
    <Fragment>
      {hasMounted && isDesktop ? (
        <NextAuthProvider>
          <QuickMenuDesktop />
        </NextAuthProvider>
      ) : (
        <NextAuthProvider>
          <QuickMenuMobile />
        </NextAuthProvider>
      )}
    </Fragment>
  );
};

export default QuickMenu;
