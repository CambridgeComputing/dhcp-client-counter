# DHCP Client Counter
An app for monitoring Windows DHCP Server logs for counting the number of clients over time.

## Purpose
This started as a project for a public library for the purposes of counting the number of users on their public network for county reporting purposes. Previously, a Meraki system was in place and did a pretty good job of tracking the users of the public WiFi network. This, combined with filters to exclude devices that never generated any traffic, gave the county a good representation of the utilization of the internet access that the library was providing. The new Unifi WiFi network by Ubiquity did not offer such a granular reporting mechanism, prompting the development in this repository.

## Tech Stack
The included app is coded in Node.JS with an InfluxDB storage backend. If this project evolves beyond its intended purpose or is forked, this stack will provide great flexibility in reporting, storage, expandibility, as well as be properly suited for a dashboard (Grafana) or other time-series purposes (since DHCP leases are given throughout time and offered with time-based expirations).

## Deployment
Docker. To do...

## Accessing Data and Reports
URL, port, API. To do...