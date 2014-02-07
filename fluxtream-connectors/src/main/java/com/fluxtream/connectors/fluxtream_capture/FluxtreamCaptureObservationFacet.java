package com.fluxtream.connectors.fluxtream_capture;

import javax.persistence.Entity;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import com.fluxtream.connectors.annotations.ObjectTypeSpec;
import com.fluxtream.connectors.mymee.MyMeePhotoFacetFinderStrategy;
import com.fluxtream.domain.AbstractFacet;

/**
 *
 * @author Candide Kemmler (candide@fluxtream.com)
 */
@Entity(name="Facet_FluxtreamObservation")
@ObjectTypeSpec(name = "observation", value = 1, isImageType=true, parallel=false, prettyname = "Observation", photoFacetFinderStrategy=MyMeePhotoFacetFinderStrategy.class)
@NamedQueries({
      @NamedQuery(name = "fluxtream.observation.byMymeeId", query = "SELECT facet FROM Facet_FluxtreamObservation facet WHERE facet.guestId=? AND facet.mymeeId=?"),
      @NamedQuery(name = "fluxtream.photo.between", query = "SELECT facet FROM Facet_FluxtreamObservation facet WHERE facet.guestId=? AND facet.start>=? AND facet.end<=? AND facet.imageURL IS NOT NULL")
})

// Most of the fields are optional;  non-optional fields are labeled as NotNull

public class FluxtreamCaptureObservationFacet extends AbstractFacet {
    // NotNull
    public String mymeeId;

    // User-friendly name of Mymee "topic" -- the name of the Mymee button used to make the observation.
    // See getChannelName for the datastore/URL version of this (datastore puts each topic in a different channel)
    // NotNull
    public String name;

    public String note;
    public String user;

    public Integer timezoneOffset;

    public Double amount;
    public Integer baseAmount;
    public String unit;
    public String baseUnit;

    public String imageURL;

    public Double latitude;
    public Double longitude;

    public FluxtreamCaptureObservationFacet() {
        super();
    }

    public FluxtreamCaptureObservationFacet(final long apiKeyId) {
        super(apiKeyId);
    }

    @Override
    protected void makeFullTextIndexable() {
    }

    // Returns the channel name used by datastore and in datastore-related URLs
    public String getChannelName() {
        // Datastore channel names have all characters that aren't alphanumeric or underscores replaced with underscores
        return name.replaceAll("[^0-9a-zA-Z_]+", "_");
    }
}
