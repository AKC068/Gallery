import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import { List } from "antd";
import SearchBar from "./SearchBar";
import PhotoModal from "./Modal";

const API_KEY = "608a899ed2a7091009b6e910a79d5057";
const API_URL = "https://api.flickr.com/services/rest/";
const SAFE_SEARCH = 1;
const size_suffix = "w";
const RESULTS_PER_PAGE = 40;

const App = () => {
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1); // initially page set to 1
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    // To Fetch data on initial load
    fetchRecentPhotos(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchRecentPhotos = async (inputPage) => {
    // responsible for fetching recent photos
    try {
      setLoading(true);
      if (inputPage !== page) setSearchQuery("");

      const response = await axios.get(API_URL, {
        params: {
          api_key: API_KEY,
          method: "flickr.photos.search",
          safe_search: SAFE_SEARCH,
          content_type: 1,
          content_types: 0,
          in_gallery: true,
          text: "",
          page: inputPage,
          format: "json",
          extras: "description",
          nojsoncallback: 1,
          per_page: RESULTS_PER_PAGE,
        },
      });

      // Process the response data as per the Flickr API documentation

      const totalPhotos = response?.data?.photos?.total;
      const photo = response?.data?.photos?.photo || [];

      if (inputPage === 1) {
        setPhotos(photo);
      } else {
        setPhotos((prevPhotos) => [...prevPhotos, ...photo]); // Append the fetched photos to the existing ones
      }
      setHasMore(page * RESULTS_PER_PAGE < totalPhotos); // Calculates total no. of photos and send to InfiniteScroll
      setLoading(false);
    } catch (error) {
      console.error("Error fetching recent photos:", error);
      setLoading(false);
    }
  };

  const fetchSearchPhotos = async (query, inputPage) => {
    // responsible for fetching searched photos
    try {
      setLoading(true);
      if (searchQuery !== query) setSearchQuery(query);

      const response = await axios.get(API_URL, {
        params: {
          api_key: API_KEY,
          method: "flickr.photos.search",
          safe_search: SAFE_SEARCH,
          content_type: 1,
          content_types: 0,
          in_gallery: true,
          text: query,
          page: inputPage,
          format: "json",
          extras: "description",
          nojsoncallback: 1,
          per_page: RESULTS_PER_PAGE,
        },
      });

      // Process the response data as per the Flickr API documentation

      const totalPhotos = response?.data?.photos?.total;
      const photo = response?.data?.photos?.photo || [];

      if (inputPage === 1) {
        setPhotos(photo);
      } else {
        setPhotos((prevPhotos) => [...prevPhotos, ...photo]); // Append the fetched photos to the existing ones
      }
      setHasMore(page * RESULTS_PER_PAGE < totalPhotos); // Calculates total no. of photos and send to InfiniteScroll
      setLoading(false);
    } catch (error) {
      console.error("Error searching photos:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Make scroll to go to top and set page to 1 whenever searchQuery is changed
    window.scrollTo(0, 0);
    setPage(1);
  }, [searchQuery]);

  useEffect(() => {
    // Continuation to above when page changes, it check conditions and make the API call as per change in searchQuery
    if (page > 1) {
      searchQuery
        ? fetchSearchPhotos(searchQuery, page)
        : fetchRecentPhotos(page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleLoadMore = () => {
    // triggers when scrolled down
    if (!loading) {
      // Check if data is loaded
      setPage((prevPage) => prevPage + 1); // increment in page to get next page data
    }
  };

  const handlePreview = (photo) => {
    setSelectedPhoto(photo); // photo is selected to preview in modal box
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPhoto(null);
  };

  return (
    <div className="app">
      <div className="header">
        <div className="hoverEffect">
          <div></div>
        </div>
        <h1>Gallery</h1>
        <SearchBar // passsing the data with callback of APIs from child to parent
          getSearch={fetchSearchPhotos}
          callBackAPI={fetchRecentPhotos}
        />
      </div>
      <div className="gallery">
        <InfiniteScroll
          dataLength={photos.length}
          next={handleLoadMore}
          hasMore={hasMore}
          endMessage={<p>No more photos to load.</p>}
        >
          <List
            grid={{
              gutter: 24,
              xs: 2,
              sm: 3,
              md: 4,
              lg: 4,
              xl: 4,
              xxl: 4,
            }}
            dataSource={photos}
            loading={loading}
            renderItem={(
              photo // render images on the UI
            ) => (
              <List.Item>
                <div onClick={() => handlePreview(photo)}>
                  <img
                    className="image"
                    src={`https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_${size_suffix}.jpg`}
                    alt={photo.title}
                  />
                </div>
              </List.Item>
            )}
          />
        </InfiniteScroll>
      </div>
      <PhotoModal
        visible={showModal}
        onClose={handleCloseModal}
        photo={selectedPhoto}
      />
    </div>
  );
};

export default App;
