(function InitializePageData() {

    GetData();
    $("#submit-btn").click(function (e) {
        let searchString = $("#searchText").val();
        GetData(searchString);
    });

    function GetData(searchString) {
        $.ajax({
            type: "GET",
            url: "/json/data.json",
            dataType: "json",
            success: function (response) {

                let hotels = response[1].entries;

                let filteredHotels = FilterData(hotels, searchString);

                InitializePriceRange(filteredHotels);
                InitializeLocations(filteredHotels);
                InitializeFilters(filteredHotels);

                $('.listing-hotels').html("");
                filteredHotels.forEach(PrintHotel);
            }
        })
    };

    function FilterData(hotels, searchString) {

        if (!searchString)
            return hotels;

        let filteredHotels = [];
        for (var hotel of hotels) {
            if (hotel.city.toUpperCase().includes(searchString.toUpperCase()))
                filteredHotels.push(hotel);
        }
        return filteredHotels;
    };
    function InitializePriceRange(hotels) {

        if (hotels.length <= 0) {
            $("#max-price").text(`No Results Found`);
            $("#price-range").attr("min", 0).attr("max", 10).attr("value", 5);
            return;
        }

        let hotelsByPrice = hotels;
        hotelsByPrice.sort((h1, h2) => h1.price - h2.price);

        let minPrice = hotelsByPrice[0].price;
        let maxPrice = hotelsByPrice[hotelsByPrice.length - 1].price;

        $("#max-price").text(`max. $${maxPrice}`);
        $("#price-range").attr("min", minPrice).attr("max", maxPrice).attr("value", maxPrice);
    }
    function InitializeLocations(hotels) {

        if (hotels.length <= 0) {
            $("#hotel-locations-select").html("<option selected>No Results Found</option>");
            return;
        }

        let hotelLocations = hotels.map((hotel) => hotel.city);
        let uniqueLocations = [];

        for (var i in hotelLocations) {
            if (!uniqueLocations.includes(hotelLocations[i]))
                uniqueLocations.push(hotelLocations[i]);
        }

        uniqueLocations.sort();

        let select = $("#hotel-locations-select").html("<option selected>All</option>");

        uniqueLocations.forEach((location) => select.append(`<option value="${location}">${location}</option>`));
    }
    function InitializeFilters(hotels) {

        if (hotels.length <= 0) {
            $("#hotel-filters-select").html("<option selected>No Results Found</option>");
            return;
        }

        let hotelFilters = [];

        for (var i in hotels) {
            for (var j in hotels[i].filters) {
                hotelFilters.push(hotels[i].filters[j])
            }
        }

        let uniqueFilters = [];

        for (var i in hotelFilters) {
            if (!uniqueFilters.includes(hotelFilters[i].name))
                uniqueFilters.push(hotelFilters[i].name);
        }

        uniqueFilters.sort();

        let select = $("#hotel-filters-select").html("<option value='' selected>All</option>");

        uniqueFilters.forEach((location) => select.append(`<option value="${location}">${location}</option>`));

    }
    function PrintHotel(hotel) {

        let hotelCardsContainer = $('.listing-hotels');

        let template = `<div class="hotel-card">
                    <div class="photo" style="background: url(${hotel.thumbnail}); background-position: center">
                        <i class="fa fa-heart"></i>
                        <span>1/30</span>
                    </div>
                    <div class="details">
                        <h3 class="hotel-name-sort hotel-name-filter">${hotel.hotelName}</h3>
                        <div class="rating" style="display:inline;">
                            <div>
                                <span class="hotel-star-filter">${Rating(hotel.rating)}</span>
                                <span>Hotel</span>
                            </div>
                        </div>
                        <div class="location">
                            <span class="hotel-city-sort hotel-city-filter">${hotel.city}</span>, 0.2 miles to Champs Elysees
                        </div>
                        <div class="reviews">
                            <span class="total hotel-rating-filter">${hotel.ratings.no.toPrecision(2)}</span>
                            <strong>${hotel.ratings.text}</strong>
                            <small>(1736 Reviews)</small>
                        </div>

                        <div class="location-reviews">
                            Excellent location <small>(${(hotel.ratings.no + 0.4).toPrecision(2)}/10)</small>
                        </div>
                    </div>

                    <div class="third-party-prices">
                        <div class="sites-and-prices">
                            <div class="highlited">
                                Hotel website
                                <strong class="hotel-price-sort hotel-price-filter">$${hotel.price}</strong>
                            </div>
                            <div>
                                Agoda
                                <strong>$${(hotel.price * 1.05).toFixed(2)}</strong>
                            </div>
                            <div>
                                Travelosity
                                <strong>$${hotel.price + 2}</strong>
                            </div>
                        </div>
                        <div class="more-deals">
                            <strong>More deals from</strong>
                            <strong>$${hotel.price} <i class="fa fa-chevron-down"></i></strong>
                        </div>
                    </div>

                    <div class="call-to-action">
                        <div class="price">
                            <div class="before-discount">
                                HotelPower.com
                                <strong><s>$${(hotel.price * 1.29).toFixed(2)}</s></strong>
                            </div>
                            <div class="after-discount">
                                Travelosity
                                <strong>$${hotel.price}</strong>
                                <div class="total">
                                    3 nights for <strong>$${hotel.price * 3}</strong>
                                </div>
                                <div class="usp">
                                    <span>Free Breakfast</span>
                                </div>
                            </div>
                            <div class="button">
                                <a href="#">View Deal <i class="fa fa-chevron-right"></i></a>
                            </div>
                        </div>
                    </div>
                    <ul class="filters">
                        ${Filters(hotel.filters)}
                    </ul>
                </div>`;

        hotelCardsContainer.append(template);

        function Rating(rating) {

            if (rating == 1) {
                return `<i class="fa fa-star"></i>`
            }
            else if (rating == 2) {
                return `<i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>`
            }
            else if (rating == 3) {
                return `<i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>`
            }
            else if (rating == 4) {
                return `<i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>`
            }
            else if (rating == 5) {
                return `<i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>`
            }
            else {
                return `<i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>`
            }
        }
        function Filters(filters) {
            let result = "";
            for (var i in filters) {
                result += `<li>${filters[i].name}</li>`;
            }
            return result;
        }
    }

})();
(function InitializeModalMap() {
    let modal = $("#mapModal");
    let btn = $("#btn-view-map");
    let closeBtn = $(".close");

    btn.click(function () {
        modal.css("display", "block");
    });

    closeBtn.click(function () {
        modal.css("display", "none");
    });

    $(window).click(function (e) {
        if (e.target.classList.contains("modal")) {
            modal.css("display", "none");
        }
    });

})();
(function InitializeFilterControlers() {

    $("#price-range").change(Filter);
    $("#hotel-star-select").change(Filter);
    $("#hotel-rating-select").change(Filter);
    $("#hotel-locations-select").change(Filter);
    $("#hotel-filters-select").change(Filter);
    function Filter() {

        let filterContainer = $("#filter-container");

        let priceFilter, starFilter, ratingFilter, locationFilter, filtersFilter;

        (function InitializeFilterValues() {
            priceFilter = filterContainer.find("#price-range").val();
            starFilter = filterContainer.find("#hotel-star-select").val();
            ratingFilter = filterContainer.find("#hotel-rating-select").val();
            locationFilter = filterContainer.find("#hotel-locations-select").val();
            filtersFilter = filterContainer.find("#hotel-filters-select").val();
        })();

        let hotelCards = $(".listing-hotels > .hotel-card");

        for (var hotel of hotelCards) {
            let str = hotel.getElementsByClassName(`hotel-price-filter`)[0].innerText;
            let price = parseFloat(str.slice(1, str.length));

            if (price > priceFilter) {
                hotel.style.display = "none";
                continue;
            }

            let star = hotel.getElementsByClassName(`hotel-star-filter`)[0].getElementsByTagName("i");

            if (star.length != starFilter && starFilter != 0) {
                hotel.style.display = "none";
                continue;
            }

            let rating = parseFloat(hotel.getElementsByClassName(`hotel-rating-filter`)[0].innerText);

            if (ratingFilter != "All") {
                let minRatingFilter = parseFloat(ratingFilter.split("-")[0]);
                let maxRatingFilter = parseFloat(ratingFilter.split("-")[1]);

                if (rating < minRatingFilter || rating >= maxRatingFilter) {
                    hotel.style.display = "none";
                    continue;
                }
            }

            let city = hotel.getElementsByClassName(`hotel-city-filter`)[0].innerText.toUpperCase();

            if (city != locationFilter.toUpperCase() && locationFilter.toUpperCase() != "ALL") {
                hotel.style.display = "none";
                continue;
            }

            let filters = hotel.getElementsByClassName(`filters`)[0].getElementsByTagName("li");

            let filterValues = [];

            for (var filter of filters) {
                filterValues.push(filter.innerText);
            }

            if (filtersFilter && !filterValues.includes(filtersFilter)) {
                hotel.style.display = "none";
                continue;
            }

            hotel.style.display = "";
        }

    };

})();
(function InitializeSorting() {
    $("#sorting").change(function (e) {
        let sorter = $("#sorting option:selected").text()

        SortBy(sorter);
    });
    function SortBy(sorter) {

        let hotelContainer = $(".listing-hotels");

        let hotelCards = hotelContainer.children(".hotel-card");

        hotelCards.sort((a, b) => sortFunction(a, b, sorter));

        function sortFunction(hc1, hc2, sorter) {

            let sortValue1;
            let sortValue2;

            switch (sorter) {
                case "Hotel Name":
                    sortValue1 = hc1.getElementsByClassName(`hotel-name-sort`)[0].innerText;
                    sortValue2 = hc2.getElementsByClassName(`hotel-name-sort`)[0].innerText;
                    break;
                case "City":
                    sortValue1 = hc1.getElementsByClassName(`hotel-city-sort`)[0].innerText;
                    sortValue2 = hc2.getElementsByClassName(`hotel-city-sort`)[0].innerText;
                    break;
                case "Price":
                    str1 = hc1.getElementsByClassName(`hotel-price-sort`)[0].innerText;
                    str2 = hc2.getElementsByClassName(`hotel-price-sort`)[0].innerText;
                    sortValue1 = parseFloat(str1.slice(1, str1.length));
                    sortValue2 = parseFloat(str2.slice(1, str2.length));
                    break;
                default:
                    str1 = hc1.getElementsByClassName(`hotel-price-sort`)[0].innerText;
                    str2 = hc2.getElementsByClassName(`hotel-price-sort`)[0].innerText;
                    sortValue1 = parseFloat(str1.slice(1, str1.length));
                    sortValue2 = parseFloat(str2.slice(1, str2.length));
                    break;
            }

            if (sortValue1 < sortValue2)
                return -1;
            if (sortValue1 > sortValue2)
                return 1;

            return 0;
        };

        hotelContainer.append(hotelCards);
    }
})();