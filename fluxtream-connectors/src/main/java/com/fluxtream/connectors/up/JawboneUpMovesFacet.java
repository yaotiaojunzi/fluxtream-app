package com.fluxtream.connectors.up;

import java.util.ArrayList;
import java.util.List;
import javax.persistence.CollectionTable;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import com.fluxtream.connectors.annotations.ObjectTypeSpec;
import com.fluxtream.domain.AbstractFacet;
import org.hibernate.annotations.Index;

/**
 * User: candide
 * Date: 28/01/14
 * Time: 15:14
 */
@Entity(name="Facet_JawboneUpMoves")
@NamedQueries({
      @NamedQuery(name = "up.moves.latest", query = "SELECT facet FROM Facet_JawboneUpMoves facet WHERE facet.apiKeyId=? ORDER BY facet.start DESC LIMIT 1")
})
@ObjectTypeSpec(name = "moves", value = 2, prettyname = "Moves", isDateBased = true)
public class JawboneUpMovesFacet extends AbstractFacet {

    @Index(name="xid")
    public String xid;
    public long time_created;
    public long time_updated;
    public long time_completed;
    public String title;

    @Index(name="date")
    public String date;
    public String snapshot_image;
    public int distance;
    public double km;
    public int steps;
    public int active_time;
    public int inactive_time;
    public int longest_active;
    public int longest_idle;
    public double calories;
    public double bmr_day;
    public double bmr;
    public double bg_calories;
    public double wo_calories;
    public int wo_time;
    public int wo_active_time;
    public int wo_count;
    public int wo_longest;
    public String tz;
    public String tzs;

    @ElementCollection(fetch= FetchType.EAGER)
    @CollectionTable(
            name = "JawboneUpMovesHourlyTotals",
            joinColumns = @JoinColumn(name="MovesRecordID")
    )
    public List<JawboneUpMovesHourlyTotals> hourlyTotals;

    @Lob
    public String intensityStorage;

    public JawboneUpMovesFacet(){super();}
    public JawboneUpMovesFacet(long apiKeyId){super(apiKeyId);}

    @Override
    protected void makeFullTextIndexable() {
    }

    public void addHourlyTotals(JawboneUpMovesHourlyTotals totals) {
        if (hourlyTotals==null)
            hourlyTotals = new ArrayList<JawboneUpMovesHourlyTotals>();
        hourlyTotals.add(totals);
    }
}
