import axios from "axios";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

const HomePage = () => {
  const [errorAddMp3Message, setErrorAddMp3Message] = useState<string>("");
  const [mp3Name, setMp3Name] = useState<string>("");
  const [mp3Image, setMp3Image] = useState<File>();
  const [mp3Sound, setMp3Sound] = useState<File>();

  const [token, setToken] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [mp3List, setMp3List] = useState<GetMp3Dto[]>([]);

  const [selectedMenu, setSelectedMenu] = useState<string>("Popular");
  const [searchMp3Input, setSearchMp3Input] = useState<string>("");

  const [commentMp3Input, setCommentMp3Input] = useState<string>("");
  const [selectedMp3Id, setSelectedMp3Id] = useState<number>(-1);
  const [selectedMp3Name, setSelectedMp3Name] = useState<string>("");

  const [commentList, setCommentList] = useState<GetCommentDto[]>([]);

  interface GetMp3Dto {
    id: number;
    name: string;
    likeCount: number;
    imageUrl?: string;
    soundUrl?: string;
    favorite: boolean;
    ownerName?: string;
  }

  interface Mp3Token {
    Token: string;
    UserId: string;
    Date: Date;
    UserName: string;
    Email: string;
    LikeLimit: number;
  }

  interface GetCommentDto {
    ownerUserName: string;
    comment: string;
    dateTime: string;
  }

  const getComments = async (mp3Id: number) => {
    try {
      console.log(mp3Id);

      const response = await axios.get(
        "http://localhost:5001/mp3/mp3comments",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          params: {
            mp3Id: mp3Id,
          },
        }
      );

      console.dir(response);
      setCommentList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const AddCommentMp3Function = async () => {
    try {
      const dto = {
        UserId: userId,
        Mp3Id: selectedMp3Id,
        Comment: commentMp3Input,
      };

      await axios.post("http://localhost:5001/mp3/addcomment", dto, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const commentMp3InputTeg = document.getElementById(
        "commentMp3Input"
      ) as HTMLInputElement;
      commentMp3InputTeg.value = "";
      setCommentMp3Input("");

      getComments(selectedMp3Id);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchMp3 = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.get("http://localhost:5001/mp3/mp3s", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        params: { userId: userId, mp3Name: searchMp3Input },
      });

      setMp3List(response.data);
      const menuItems = ["menuItemPopular", "menuItemFavorites", "menuItemAll"];
      menuItems.forEach((itemId) => {
        const menuItem = document.getElementById(itemId) as HTMLElement;
        if (menuItem) {
          menuItem.style.color = "black";
          menuItem.style.backgroundColor = "white";
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const addLikeMp3Function = async (mp3Id: number) => {
    try {
      const mp3TokenObjString = localStorage.getItem("mp3TokenObj");

      if (mp3TokenObjString) {
        const mp3TokenObj = JSON.parse(mp3TokenObjString) as Mp3Token;

        if (mp3TokenObj.LikeLimit != 0) {
          await axios.post("http://localhost:5001/mp3/addlikemp3", null, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
            params: { mp3Id: mp3Id },
          });

          selectMenuFunction(selectedMenu);
          mp3TokenObj.LikeLimit = mp3TokenObj.LikeLimit - 1;
          localStorage.setItem("mp3TokenObj", JSON.stringify(mp3TokenObj));
        } else {
          alert("Sizin Like Limitini bitib size limit gun icinde verilecek");
        }
      }
    } catch (erroe) {
      console.log(erroe);
    }
  };

  const addFavoriteMp3Function = async (mp3Id: number) => {
    try {
      await axios.post("http://localhost:5001/mp3/changefavorite", null, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        params: {
          mp3Id: mp3Id,
          userId: userId,
        },
      });

      selectMenuFunction(selectedMenu);
    } catch (error) {
      console.log(error);
    }
  };

  const selectMenuFunction = async (selectedName: string) => {
    setSelectedMenu(selectedName);

    const menuItems = [
      "menuItemPopular",
      "menuItemFavorites",
      "menuItemAll",
      "menuItemMyMp3",
    ];
    menuItems.forEach((itemId) => {
      const menuItem = document.getElementById(itemId) as HTMLElement;
      if (menuItem) {
        menuItem.style.color = "white";
        menuItem.style.backgroundColor = "#121212";
      }
    });

    const selectedMenuItem = document.getElementById(
      `menuItem${selectedName}`
    ) as HTMLElement;
    if (selectedMenuItem) {
      selectedMenuItem.style.color = "#121212";
      selectedMenuItem.style.backgroundColor = "#1DB954";
    }

    try {
      switch (selectedName) {
        case "Popular":
          try {
            const response = await axios.get(
              "http://localhost:5001/mp3/popular",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "multipart/form-data",
                },
                params: {
                  userId: userId,
                },
              }
            );
            console.dir(response);
            setMp3List(response.data);
          } catch (error) {
            console.log("Error Favorite Mp3  " + error);
          }
          break;
        case "Favorites":
          try {
            const response = await axios.get(
              "http://localhost:5001/mp3/favorites",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "multipart/form-data",
                },
                params: {
                  userId: userId,
                },
              }
            );
            console.dir(response);
            setMp3List(response.data);
          } catch (error) {
            console.log("Error Favorite Mp3  " + error);
          }
          break;
        case "MyMp3":
          try {
            const response = await axios.get(
              "http://localhost:5001/mp3/mymp3s",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "multipart/form-data",
                },
                params: {
                  userId: userId,
                },
              }
            );
            console.dir(response);
            setMp3List(response.data);
          } catch (error) {
            console.log("Error Favorite Mp3  " + error);
          }
          break;
        case "All":
          try {
            const response = await axios.get("http://localhost:5001/mp3/mp3s", {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
              params: {
                userId: userId,
              },
            });
            console.dir(response);
            setMp3List(response.data);
          } catch (error) {
            console.log("Error Favorite Mp3  " + error);
          }
          break;
        default:
          break;
      }
    } catch (error) {
      console.error("Error fetching MP3 data:", error);
    }
  };

  const getFavoriteMp3s = async () => {
    const mp3TokenObjString = localStorage.getItem("mp3TokenObj");

    if (mp3TokenObjString) {
      const mp3TokenObj = JSON.parse(mp3TokenObjString) as Mp3Token;

      setToken(mp3TokenObj.Token);
      setUserId(mp3TokenObj.UserId);

      try {
        const response = await axios.get("http://localhost:5001/mp3/popular", {
          headers: {
            Authorization: `Bearer ${mp3TokenObj.Token}`,
            "Content-Type": "multipart/form-data",
          },
          params: {
            userId: mp3TokenObj.UserId,
          },
        });

        console.dir(response);

        setMp3List(response.data);
      } catch (error) {
        console.log("Error Favorite Mp3  " + error);
      }
    }
  };

  useEffect(() => {
    getFavoriteMp3s();
    const commentMp3Input = document.getElementById(
      "commentMp3Input"
    ) as HTMLInputElement;
    const commentMp3Button = document.getElementById(
      "commentMp3Button"
    ) as HTMLButtonElement;

    commentMp3Input.disabled = true;
    commentMp3Button.disabled = true;
  }, []);

  const handleAddMp3Submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const handleAddMp3 = async () => {
      try {
        const formData = new FormData();

        formData.append("UserId", userId);
        formData.append("Name", mp3Name);

        if (mp3Image) {
          formData.append("ImageFile", mp3Image);
        } else {
          console.error("No image file selected");
        }

        if (mp3Sound) {
          formData.append("Mp3File", mp3Sound);
        } else {
          console.error("No mp3 file selected");
        }

        const response = await axios.post(
          "http://localhost:5001/mp3/add",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        setMp3Name("");
        setMp3Image(undefined);
        setMp3Sound(undefined);
        const mp3ImageVariable = document.getElementById(
          "mp3Image"
        ) as HTMLInputElement;

        const mp3SoundVariable = document.getElementById(
          "mp3Sound"
        ) as HTMLInputElement;

        mp3SoundVariable.value = "";

        mp3ImageVariable.value = "";

        selectMenuFunction(selectedMenu);

        console.log("MP3 Added:", response.data);
      } catch (error) {
        console.error("Error adding MP3:", error);
      }
    };

    handleAddMp3();
  };
  return (
    <div style={{ backgroundColor: "#121212" }} className="container-fluid">
      <div
        className="row"
        style={{ height: "100vh", backgroundColor: "#121212" }}
      >
        <div
          className="col-md-3 col-lg-2"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            backgroundColor: "#121212",
            height: "100vh",
            overflowY: "auto",
            display: "flex",
            justifyContent: "left",
            padding: 0,
            overflowX: "hidden",
            whiteSpace: "nowrap",
            width: "220px",
          }}
        >
          <div className="card shadow-lg">
            <div
              className="card-body"
              style={{ width: 400, backgroundColor: "#121212" }}
            >
              <h3
                className="text-center"
                style={{
                  color: "#1DB954",
                  position: "relative",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "50%",
                  paddingBottom: 10,
                }}
              >
                MP3 Menu
              </h3>

              <nav className="nav flex-column">
                <a
                  id="menuItemFavorites"
                  className="nav-link"
                  style={{
                    color: "#1DB954",
                    padding: 10,
                    fontSize: 20,
                    display: "flex",
                    justifyContent: "center",
                    borderRadius: 5,
                    width: "50%",
                    cursor: "pointer",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    selectMenuFunction("Favorites");
                  }}
                >
                  Favorites
                </a>
                <a
                  id="menuItemMyMp3"
                  className="nav-link"
                  style={{
                    color: "#1DB954",
                    padding: 10,
                    fontSize: 20,
                    display: "flex",
                    justifyContent: "center",
                    borderRadius: 5,
                    width: "50%",
                    cursor: "pointer",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    selectMenuFunction("MyMp3");
                  }}
                >
                  My Mp3
                </a>
                <a
                  id="menuItemAll"
                  className="nav-link"
                  href="#"
                  style={{
                    color: "#1DB954",
                    backgroundColor: "#121212",
                    padding: 10,
                    fontSize: 20,
                    display: "flex",
                    justifyContent: "center",
                    borderRadius: 5,
                    width: "50%",
                    cursor: "pointer",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    selectMenuFunction("All");
                  }}
                >
                  All
                </a>

                <button
                  style={{
                    color: "white",
                    background: "red",
                    padding: 10,
                    fontSize: 20,
                    display: "flex",
                    justifyContent: "center",
                    borderRadius: 5,
                    border: 0,
                    width: "50%",
                    marginTop: 20,
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    const confirmation = window.confirm(
                      "Are you sure you want to log out?"
                    );
                    if (confirmation) {
                      localStorage.removeItem("mp3TokenObj");
                      document.location.href = "/";
                    }
                  }}
                >
                  Log Out
                </button>
              </nav>
            </div>
          </div>
        </div>

        <div
          style={{
            marginLeft: 215,
            marginRight: "auto",

            padding: "30px 20px",

            width: 1130,
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
              padding: "30px",
              backgroundColor: "#121212",
              color: "white",
            }}
          >
            {mp3List.map((mp3) => (
              <div
                key={mp3.id}
                style={{
                  backgroundColor: "#181818",
                  borderRadius: "10px",
                  width: "220px",
                  padding: "15px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
                  transition: "transform 0.2s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                {/* Favorite Icon */}
                <div
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    cursor: "pointer",
                  }}
                  onClick={() => addFavoriteMp3Function(mp3.id)}
                >
                  <img
                    src={`./public/heart_${mp3.favorite ? "on" : "off"}.png`}
                    alt={`heart_${mp3.favorite ? "on" : "off"}`}
                    style={{ width: "25px", height: "25px" }}
                  />
                </div>

                {/* MP3 Image */}
                <img
                  src={mp3.imageUrl}
                  alt={mp3.name}
                  style={{
                    width: "100%",
                    height: "140px",
                    borderRadius: "5px",
                    objectFit: "cover",
                    marginBottom: "10px",
                  }}
                />

                {/* MP3 Name */}
                <h4
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "white",
                    marginBottom: "10px",
                    textAlign: "center",
                  }}
                >
                  {mp3.name}
                </h4>

                {/* Like Button */}
                <button
                  onClick={() => addLikeMp3Function(mp3.id)}
                  style={{
                    backgroundColor: "#1DB954",
                    color: "white",
                    border: "none",
                    borderRadius: "20px",
                    padding: "10px 15px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    width: "100%",
                    marginBottom: "10px",
                    transition: "background-color 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#18a149";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#1DB954";
                  }}
                >
                  Like Count: {mp3.likeCount}
                </button>

                {/* Audio Player */}
                <audio
                  controls
                  style={{
                    width: "100%",
                    marginTop: "10px",
                  }}
                >
                  <source src={mp3.soundUrl} type="audio/mpeg" />
                </audio>
              </div>
            ))}
          </div>
        </div>

        <div
          className="col-md-3"
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            backgroundColor: "#1DB954",
            height: "100vh",
            padding: 0,
            width: "48vh",
          }}
        >
          <div
            style={{ backgroundColor: "#121212" }}
            className="card shadow-lg p-4"
          >
            <h3 className="mb-4 text-center" style={{ color: "#1DB954" }}>
              Add MP3
            </h3>
            <form
              onSubmit={handleAddMp3Submit}
              style={{
                height: "100vh",
              }}
            >
              <div className="mb-3">
                <label
                  htmlFor="mp3Name"
                  style={{ color: "#1DB954" }}
                  className="form-label"
                >
                  MP3 Name
                </label>
                <input
                  name="mp3Name"
                  id="mp3Name"
                  placeholder="Enter MP3 Name"
                  type="text"
                  className="form-control"
                  required
                  value={mp3Name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    if (e.target.value.length > 23) {
                      setErrorAddMp3Message(
                        "Mp3 Name Maksimum 20 simvol ola biler"
                      );
                      return;
                    } else {
                      setErrorAddMp3Message("");
                      setMp3Name(e.target.value);
                    }
                  }}
                />
              </div>

              <div className="mb-3">
                <label
                  style={{ color: "#1DB954" }}
                  htmlFor="mp3Image"
                  className="form-label"
                >
                  MP3 Image
                </label>
                <input
                  name="mp3Image"
                  id="mp3Image"
                  type="file"
                  className="form-control"
                  accept="image/*"
                  required
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (file.type.startsWith("image/")) {
                        setMp3Image(file);
                        setErrorAddMp3Message("");
                      } else {
                        setErrorAddMp3Message(
                          "MP3 Image should be an image file."
                        );
                        const mp3ImageVariable = document.getElementById(
                          "mp3Image"
                        ) as HTMLInputElement;

                        mp3ImageVariable.value = "";
                      }
                    }
                  }}
                />
              </div>

              <div className="mb-3">
                <label
                  style={{ color: "#1DB954" }}
                  htmlFor="mp3Sound"
                  className="form-label"
                >
                  MP3 Sound
                </label>
                <input
                  name="mp3Sound"
                  id="mp3Sound"
                  type="file"
                  className="form-control"
                  required
                  accept="audio/mpeg"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (file.name.endsWith(".mp3")) {
                        setMp3Sound(file);
                        setErrorAddMp3Message("");
                      } else {
                        setErrorAddMp3Message(
                          "Only MP3 sound files are allowed."
                        );
                        setMp3Sound(undefined);
                        const mp3SoundVariable = document.getElementById(
                          "mp3Sound"
                        ) as HTMLInputElement;

                        mp3SoundVariable.value = "";
                      }
                    }
                  }}
                />
              </div>

              {errorAddMp3Message && (
                <p style={{ color: "red" }}>{errorAddMp3Message}</p>
              )}

              <button
                style={{ backgroundColor: "#1DB954" }}
                type="submit"
                className="btn w-100"
              >
                Add MP3
              </button>
            </form>
          </div>

          <div
            style={{
              padding: "10px",
              position: "absolute",
              flexDirection: "column",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 3,
              top: 400,
            }}
          >
            <div
              style={{
                maxHeight: "230px",
                overflowY: "scroll",
                width: 365,
                paddingRight: "10px",
                marginRight: "-5px",
                boxSizing: "content-box",
              }}
            >
              {commentList.map((item, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: "10px",
                    padding: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "5px",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <strong style={{ color: "#0d6efd" }}>
                    {item.ownerUserName} - {item.dateTime}
                  </strong>
                  <p style={{ margin: "5px 0" }}>{item.comment}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                AddCommentMp3Function();
              }}
              style={{
                display: "flex",
                justifyContent: "start",
                alignItems: "center",
                padding: 10,

                gap: 10,
                position: "absolute",
                top: 750,
                zIndex: 4,
              }}
            >
              <input
                name="commentMp3Input"
                id="commentMp3Input"
                placeholder="Search..."
                type="text"
                className="form-control"
                required
                style={{ width: 270, opacity: selectedMp3Id === -1 ? 0.5 : 1 }}
                value={commentMp3Input}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  if (e.target.value.length > 35) {
                    return;
                  } else {
                    setCommentMp3Input(e.target.value);
                  }
                }}
              />
              <button
                id="commentMp3Button"
                style={{
                  borderRadius: 5,
                  border: "0",
                  opacity: selectedMp3Id === -1 ? 0.5 : 1,
                  cursor: selectedMp3Id === -1 ? "not-allowed" : "pointer",
                  padding: "5px 20px",
                  color: "white",
                  background: "#0d6efd",
                  fontWeight: "revert",
                }}
                type="submit"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
