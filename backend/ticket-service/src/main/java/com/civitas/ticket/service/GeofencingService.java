package com.civitas.ticket.service;

// import jakarta.annotation.PostConstruct;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.stereotype.Service;

@Service
public class GeofencingService {

    private static final double LNG_MIN = 9.0;
    private static final double LNG_MAX = 10.0;
    private static final double LAT_MIN = 45.0;
    private static final double LAT_MAX = 46.0;

    public boolean isWithinCityLimits(GeoJsonPoint point) {
        if (point == null)
            return false;

        double lng = point.getX(); // Longitudine
        double lat = point.getY(); // Latitudine

        // Controlla se le coordinate cadono dentro il range
        boolean isInside = (lng >= LNG_MIN && lng <= LNG_MAX) &&
                (lat >= LAT_MIN && lat <= LAT_MAX);

        // Log per vedere cosa succede nel terminale
        System.out.println("Verifica Geofencing - Lng: " + lng + " Lat: " + lat + " -> Risultato: " + isInside);

        return isInside;
    }
}