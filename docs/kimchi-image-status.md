# Kimchi Image URL Status Report

**Date**: 2026-03-20

## Summary

- **Total kimchi entries**: 55
- **Entries with imageUrl**: 55 (100%)
- **Unique image URLs**: 13
- **Broken URLs found**: 0

## Unique Image URLs

| # | URL | Used by | Status |
|---|-----|---------|--------|
| 1 | `Korean.food-kimchi-02.jpg` | 37 entries (baechu, godeulppaegi, minari, goguma, yangbaechu, putbaechu, sulkimchi, jangkimchi, sukchae, ueong, doraji, myeolchi, gochu, maneul, changnan, sigeumchi, sukjunamul, gulkimchi, jokbal, jeotgal, hobak, gaji, dalrae, naengi, ssuk, buchukimchi, sangchu, yulmukimchi, jukkumi, jogaejeotgal, kodari, meokgalkimchi, ggwarigochu, ojingeo, jinju, andong, geoje, jeju) | 200 OK |
| 2 | `Korean.food-kkakdugi-01.jpg` | 3 entries (kkakdugi, mumallaengi, museongchae) | 200 OK |
| 3 | `Korean_cuisine-Chonggak_kimchi-01.jpg` | 2 entries (chonggak, altari) | 200 OK |
| 4 | `Korean_cuisine-Nabak_kimchi-01.jpg` | 2 entries (nabak, seokbakji) | 200 OK |
| 5 | `Korean-Dongchimi-01.jpg` | 1 entry (dongchimi) | 200 OK |
| 6 | `Yeolmu-kimchi.jpg` | 1 entry (yeolmu) | 200 OK |
| 7 | `Oi-sobagi.jpg` | 1 entry (oisobagi) | 200 OK |
| 8 | `Gat-gimchi.jpg` | 1 entry (gat) | 200 OK |
| 9 | `Pa-gimchi.jpg` | 1 entry (pa) | 200 OK |
| 10 | `Bossam-kimchi_(cropped).jpg` | 1 entry (bossam) | 200 OK |
| 11 | `Baek-kimchi.jpg` | 1 entry (baek) | 200 OK |
| 12 | `Kkaennip-kimchi.jpg` | 2 entries (buchu, kkaennip) | 200 OK |
| 13 | `Kongnamul_muchim_(soybean_sprouts).jpg` | 1 entry (kongnamul) | 200 OK |

## Sample Verification Results (curl HEAD request)

| URL | HTTP Status |
|-----|-------------|
| `Korean.food-kimchi-02.jpg` | 200 |
| `Korean.food-kkakdugi-01.jpg` | 200 |
| `Korean_cuisine-Chonggak_kimchi-01.jpg` | 200 |
| `Yeolmu-kimchi.jpg` | 200 |
| `Kongnamul_muchim_(soybean_sprouts).jpg` | 200 |
| `Korean_cuisine-Nabak_kimchi-01.jpg` | 200 |
| `Korean-Dongchimi-01.jpg` | 200 |
| `Oi-sobagi.jpg` | 200 |
| `Gat-gimchi.jpg` | 200 |
| `Pa-gimchi.jpg` | 200 |
| `Bossam-kimchi_(cropped).jpg` | 200 |
| `Baek-kimchi.jpg` | 200 |
| `Kkaennip-kimchi.jpg` | 200 |

All 13 unique URLs were verified -- all returned HTTP 200.

## Issues & Recommendations

1. **Placeholder image overuse**: 37 out of 55 kimchi entries (67%) use the same generic `Korean.food-kimchi-02.jpg` image. These entries lack distinct visual identity.
2. **No broken URLs**: All Wikimedia Commons URLs are currently accessible.
3. **Recommendation**: Find and assign unique images for the 37 entries currently using the placeholder image. Priority should be given to popular kimchi types like kkakdugi variants, regional specialties, and seasonal kimchi.
