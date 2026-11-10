import java.io.Serializable;
import java.math.BigDecimal;

public final class CheckResult implements Serializable {
    private final BigDecimal x;
    private final BigDecimal y;
    private final BigDecimal r;
    private final boolean hit;

    public CheckResult(BigDecimal x, BigDecimal y, BigDecimal r, boolean hit) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.hit = hit;
    }

    public String getX() {
        return x.toPlainString();
    }

    public String getY() {
        return y.toPlainString();
    }

    public String getR() {
        return r.toPlainString();
    }

    public boolean isHit() {
        return hit;
    }
}
