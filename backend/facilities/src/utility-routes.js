import axios from "axios";

export function registerUtilityRoutes(app) {
  console.log("registering utility routes");

  app.get("/geocode/:address/:lat?/:lon?", async (req, res, next) => {
    const { address, lat, lon } = req.params;
    const target = new URL(
      `https://api.tomtom.com/search/2/geocode/${address}.json?key=${process.env.TOMTOM_API_KEY}`
    );
    target.searchParams.set("countrySet", "US");
    target.searchParams.set("typeahead", true);
    if (lat || lat === 0) {
      target.searchParams.set("lat", lat);
      target.searchParams.set("lon", lon);
    }
    const results = await axios.get(target.toString()).catch((error) => {
      console.error(error);
      next(error);
    });
    const {
      data: { results: data },
    } = results;

    res.send(
      (data || []).map((v) => ({
        location: {
          type: "Point",
          coordinates: [v.position.lon, v.position.lat],
        },
        address: v.address.freeformAddress,
        zip: v.address.postalCode,
        state: v.address.countrySubdivision,
      }))
    );
  });

  app.get("/borrow-search-autocomplete/:searchTerm", async (req, res, next) => {
    const { searchTerm } = req.params;
    const { latitude, longitude } = req.query || {};
    const target = new URL(
      `https://api.tomtom.com/search/2/geocode/${searchTerm}.json?key=${process.env.TOMTOM_API_KEY}`
    );
    target.searchParams.set("countrySet", "US");
    target.searchParams.set("typeahead", true);
    target.searchParams.set("idxSet", "Geo");
    target.searchParams.set(
      "entityTypeSet",
      "CountrySubdivision,CountrySecondarySubdivision,CountryTertiarySubdivision,Municipality,MunicipalitySubdivision,Neighbourhood"
    );

    if (latitude || latitude === 0) {
      target.searchParams.set("lat", latitude);
      target.searchParams.set("lon", longitude);
    }
    const results = await axios.get(target.toString()).catch((error) => {
      console.error(error);
      next(error);
    });
    const {
      data: { results: data },
    } = results;

    res.send(
      (data || []).map((v) => ({
        longitude: v.position.lon,
        latitude: v.position.lat,
        text: v.address.freeformAddress,
      }))
    );
  });
}
