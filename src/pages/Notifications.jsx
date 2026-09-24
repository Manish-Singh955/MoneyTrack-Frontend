import { useEffect, useState } from "react";
import axios from "axios";

function Notifications() {

  const [notifications, setNotifications] =
    useState([]);


  const token =
    localStorage.getItem("token");


  const getNotifications = async () => {

    try {

      const response =
        await axios.get(
          "http://localhost:5000/api/notifications",
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );


      setNotifications(
        response.data
      );


    } catch (error) {

      console.log(error);

    }

  };


  const markAsRead =
    async (id) => {

      try {

        await axios.put(

          `http://localhost:5000/api/notifications/${id}/read`,

          {},

          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }

        );


        getNotifications();

      } catch (error) {

        console.log(error);

      }

    };


  useEffect(() => {

    getNotifications();

  }, []);


  return (

    <div className="container mt-4">

      <h2>
        Notifications
      </h2>


      {notifications.length === 0 ? (

        <div className="alert alert-info">

          No notifications.

        </div>

      ) : (

        notifications.map(
          (notification) => (

            <div
              key={
                notification._id
              }

              className={
                notification.is_read
                  ? "card p-3 mb-2"
                  : "card p-3 mb-2 border-primary"
              }
            >

              <h5>
                {notification.title}
              </h5>

              <p>
                {notification.message}
              </p>


              {!notification.is_read && (

                <button
                  className="btn btn-primary"
                  onClick={() =>
                    markAsRead(
                      notification._id
                    )
                  }
                >

                  Mark as Read

                </button>

              )}

            </div>

          )
        )

      )}

    </div>

  );

}


export default Notifications;