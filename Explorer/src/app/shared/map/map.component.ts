import {
  Component,
  AfterViewInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  OnDestroy,
} from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';

@Component({
  selector: 'xp-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements AfterViewInit, OnChanges, OnDestroy {
  private map: L.Map | null = null;
  private markers: L.Marker[] = [];
  private routeControl: any = null; // ostavljeno kao any zbog typings-a za leaflet-routing-machine

  @Input() initialMarkers: L.LatLng[] = [];
  @Input() checkpoints: {
    latitude: number;
    longitude: number;
    name?: string;
    description?: string;
    imageUrl?: string;
  }[] = [];

  @Output() mapReset = new EventEmitter<void>();
  @Output() coordinatesSelected = new EventEmitter<{
    latitude: number;
    longitude: number;
  }>();
  @Output() distanceCalculated = new EventEmitter<{
    transportType: string;
    time: number;
    distance: number;
  }>();

  ngAfterViewInit(): void {
    // Default marker ikonica (CDN)
    const DefaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });
    (L.Marker.prototype as any).options.icon = DefaultIcon;

    if (!this.map) this.initMap();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.off();
      this.map.remove();
      this.map = null;
    }
  }

  ngOnChanges(): void {
    if (!this.map) return;
    // Refresh samo iz checkpoints inputa (pretpostavka da se to menja)
    this.renderFromCheckpoints();
  }

  // --- Init & layers ---
  private initMap(): void {
    this.map = L.map('map', {
      center: [45.2396, 19.8227],
      zoom: 13,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.map);

    this.registerOnClick();

    // Početni markeri (ako ih šalješ)
    this.initialMarkers.forEach((latLng) =>
      this.addMarker(L.marker(latLng).addTo(this.map!))
    );

    // Prikaz checkpoint-a + ruta
    this.renderFromCheckpoints();
  }

  // --- Click dodaje jedan marker i emituje koordinate ---
  private registerOnClick(): void {
    this.map!.on('click', (e: L.LeafletMouseEvent) => {
      // Zadržavamo logiku sa jednim markerom
      this.clearMarkersOnly();
      const { lat, lng } = e.latlng;
      const marker = L.marker([lat, lng]).addTo(this.map!);
      this.addMarker(marker);
      this.coordinatesSelected.emit({ latitude: lat, longitude: lng });
    });
  }

  // --- Render checkpoint-a i rute ---
  private renderFromCheckpoints(): void {
    // Brišemo markere i rutu pa nanosimo checkpoint-e
    this.resetMapInternal();

    this.checkpoints.forEach((checkpoint) => {
      const latLng = L.latLng(checkpoint.latitude, checkpoint.longitude);
      const popupContent = `
        <div style="width: 75px; text-align: center; padding: 3px;">
          <h5 style="margin: 0; font-size: 12px; font-weight: bold;">${
            checkpoint.name ?? ''
          }</h5>
          ${
            checkpoint.imageUrl
              ? `<img src="${checkpoint.imageUrl}" alt="Checkpoint Image" style="width: 100%; height: auto; margin: 3px 0; border-radius: 3px;" />`
              : ''
          }
          ${
            checkpoint.description
              ? `<p style="font-size: 11px; color: #666; margin: 0;">${checkpoint.description}</p>`
              : ''
          }
        </div>
      `;
      const marker = L.marker(latLng).bindPopup(popupContent).addTo(this.map!);
      marker.on('click', () => marker.openPopup());
      this.addMarker(marker);
    });

    if (this.markers.length > 1) {
      const waypoints = this.markers.map((m) => m.getLatLng());
      this.setRoute(waypoints);
    }
  }

  private setRoute(waypoints: L.LatLng[]): void {
    if (waypoints.length < 2) return;

    if (this.routeControl) {
      if (this.map!.hasLayer(this.routeControl)) {
        this.map!.removeControl(this.routeControl);
      }
      this.routeControl = null;
    }

    this.routeControl = (L as any).Routing.control({
      waypoints,
      router: (L as any).routing.mapbox(
        'pk.eyJ1IjoicmF0a292YWMiLCJhIjoiY20ybDJmdGNxMDdkMjJrc2dodncycWhhZiJ9.fkyW7QT3iz7fxVS5u5w1bg',
        { profile: 'mapbox/walking' }
      ),
    }).addTo(this.map!);

    this.routeControl.on('routesfound', (e: { routes: any[] }) => {
      const summary = e.routes[0].summary;
      const totalDistanceKm = summary.totalDistance / 1000;
      const totalTimeMinutes = Math.round(summary.totalTime / 60);
      this.distanceCalculated.emit({
        transportType: 'walking',
        time: totalTimeMinutes,
        distance: Number(totalDistanceKm.toFixed(2)),
      });
    });
  }

  // --- Helpers ---
  private addMarker(marker: L.Marker): void {
    this.markers.push(marker);
  }

  private clearMarkersOnly(): void {
    this.markers.forEach((m) => this.map!.removeLayer(m));
    this.markers = [];
  }

  private resetMapInternal(): void {
    this.clearMarkersOnly();
    if (this.routeControl) {
      this.map!.removeControl(this.routeControl);
      this.routeControl = null;
    }
  }

  // Javni reset ako ti treba spolja (čuvao sam event)
  resetMap(): void {
    this.resetMapInternal();
    this.mapReset.emit();
  }
}
