<template>
   <div class="screen active"><div class="energia-header"><div><h2 class="section-title energia-screen-title" style="margin: 0px;">Consumo de Energía</h2></div><div class="energia-period-tabs"><button class="eperiod-btn active">Hoy</button><button class="eperiod-btn">Semana</button><button class="eperiod-btn">Mes</button></div></div><div class="energia-home-selector"><span class="energia-home-selector-label"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="house" aria-hidden="true" class="lucide lucide-house"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg> Hogar:</span><div class="energia-home-selector-tabs"><button class="energia-home-btn active"><span class="energia-home-btn-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="house" aria-hidden="true" class="lucide lucide-house"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg></span> Casa Ciudad</button><button class="energia-home-btn active"><span class="energia-home-btn-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="house" aria-hidden="true" class="lucide lucide-house"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg></span> Casa Pilar</button></div></div><div class="energia-kpi-row"><div class="ekpi-card ekpi-kwh"><div class="ekpi-icon-wrap"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="zap" aria-hidden="true" class="lucide lucide-zap"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path></svg></div><div class="ekpi-val">7.0 <span class="ekpi-unit">kWh</span></div><div class="ekpi-label">Consumo hoy</div><div class="ekpi-trend ekpi-trend--up"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="trending-up" aria-hidden="true" class="lucide lucide-trending-up"><path d="M16 7h6v6"></path><path d="m22 7-8.5 8.5-5-5L2 17"></path></svg> 9% vs ayer</div></div><div class="ekpi-card ekpi-cost"><div class="ekpi-icon-wrap"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="dollar-sign" aria-hidden="true" class="lucide lucide-dollar-sign"><line x1="12" x2="12" y1="2" y2="22"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg></div><div class="ekpi-val">$102</div><div class="ekpi-label">Costo estimado</div><div class="ekpi-trend ekpi-trend--neutral"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="minus" aria-hidden="true" class="lucide lucide-minus"><path d="M5 12h14"></path></svg> promedio</div></div><div class="ekpi-card ekpi-month"><div class="ekpi-icon-wrap"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="calendar" aria-hidden="true" class="lucide lucide-calendar"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg></div><div class="ekpi-val">147 <span class="ekpi-unit">kWh</span></div><div class="ekpi-label">Proyección mes</div><div class="ekpi-trend ekpi-trend--down"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="trending-down" aria-hidden="true" class="lucide lucide-trending-down"><path d="M16 17h6v-6"></path><path d="m22 17-8.5-8.5-5 5L2 7"></path></svg> 5% vs anterior</div></div><div class="ekpi-card ekpi-co2"><div class="ekpi-icon-wrap"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="leaf" aria-hidden="true" class="lucide lucide-leaf"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path></svg></div><div class="ekpi-val">3 <span class="ekpi-unit">kg</span></div><div class="ekpi-label">CO₂ evitado</div><div class="ekpi-trend ekpi-trend--up"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="trending-up" aria-hidden="true" class="lucide lucide-trending-up"><path d="M16 7h6v6"></path><path d="m22 7-8.5 8.5-5-5L2 17"></path></svg> 3% este mes</div></div></div><div class="energia-charts-row"><div class="energia-chart-card energia-chart-card--wide"><div class="echart-header"><span class="echart-title">Consumo por hora</span><span class="echart-sub">hoy · kWh</span></div><div class="echart-body"><canvas id="barChart" width="684" height="170" style="display: block; box-sizing: border-box; height: 170px; width: 684px;"></canvas></div></div><div class="energia-chart-card energia-homes-card"><div class="echart-header"><span class="echart-title">Consumo por hogar</span><span class="echart-sub">Hoy · kWh</span></div><div class="energia-homes-list"><div class="energia-home-row"><div class="energia-home-row-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="house" aria-hidden="true" class="lucide lucide-house"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg></div><div class="energia-home-row-info"><div class="energia-home-row-name">Casa Ciudad</div><div class="energia-home-row-bar-wrap"><div class="energia-home-row-bar" style="width: 100%; background: rgb(26, 35, 126);"></div></div></div><div class="energia-home-row-kwh">4.2<span> kWh</span></div></div><div class="energia-home-row"><div class="energia-home-row-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="house" aria-hidden="true" class="lucide lucide-house"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg></div><div class="energia-home-row-info"><div class="energia-home-row-name">Casa Pilar</div><div class="energia-home-row-bar-wrap"><div class="energia-home-row-bar" style="width: 67%; background: rgb(99, 102, 241);"></div></div></div><div class="energia-home-row-kwh">2.8<span> kWh</span></div></div></div></div></div><div class="energia-breakdown"><div class="echart-header" style="margin-bottom: 14px;"><span class="echart-title">Desglose por habitación</span><span class="echart-sub">Casa Ciudad · Casa Pilar</span></div><div class="eroom-list"><div class="eroom-row"><div class="eroom-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="sofa" aria-hidden="true" class="lucide lucide-sofa"><path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3"></path><path d="M2 16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z"></path><path d="M4 18v2"></path><path d="M20 18v2"></path><path d="M12 4v9"></path></svg></div><div class="eroom-info"><div class="eroom-name">Sala de estar</div><div class="eroom-home-tag">Casa Ciudad</div><div class="eroom-bar-wrap"><div class="eroom-bar" style="width: 67%; background: rgb(26, 35, 126);"></div></div></div><div class="eroom-kwh">1.2<span> kWh</span></div></div><div class="eroom-row"><div class="eroom-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="bed" aria-hidden="true" class="lucide lucide-bed"><path d="M2 4v16"></path><path d="M2 8h18a2 2 0 0 1 2 2v10"></path><path d="M2 17h20"></path><path d="M6 8v9"></path></svg></div><div class="eroom-info"><div class="eroom-name">Dormitorio</div><div class="eroom-home-tag">Casa Ciudad</div><div class="eroom-bar-wrap"><div class="eroom-bar" style="width: 44%; background: rgb(26, 35, 126);"></div></div></div><div class="eroom-kwh">0.8<span> kWh</span></div></div><div class="eroom-row"><div class="eroom-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="utensils" aria-hidden="true" class="lucide lucide-utensils"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path><path d="M7 2v20"></path><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path></svg></div><div class="eroom-info"><div class="eroom-name">Cocina</div><div class="eroom-home-tag">Casa Ciudad</div><div class="eroom-bar-wrap"><div class="eroom-bar" style="width: 100%; background: rgb(26, 35, 126);"></div></div></div><div class="eroom-kwh">1.8<span> kWh</span></div></div><div class="eroom-row"><div class="eroom-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="droplets" aria-hidden="true" class="lucide lucide-droplets"><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"></path><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"></path></svg></div><div class="eroom-info"><div class="eroom-name">Baño</div><div class="eroom-home-tag">Casa Ciudad</div><div class="eroom-bar-wrap"><div class="eroom-bar" style="width: 17%; background: rgb(26, 35, 126);"></div></div></div><div class="eroom-kwh">0.3<span> kWh</span></div></div><div class="eroom-row"><div class="eroom-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="car" aria-hidden="true" class="lucide lucide-car"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path><circle cx="7" cy="17" r="2"></circle><path d="M9 17h6"></path><circle cx="17" cy="17" r="2"></circle></svg></div><div class="eroom-info"><div class="eroom-name">Garaje</div><div class="eroom-home-tag">Casa Ciudad</div><div class="eroom-bar-wrap"><div class="eroom-bar" style="width: 28%; background: rgb(26, 35, 126);"></div></div></div><div class="eroom-kwh">0.5<span> kWh</span></div></div><div class="eroom-row"><div class="eroom-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="sofa" aria-hidden="true" class="lucide lucide-sofa"><path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3"></path><path d="M2 16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z"></path><path d="M4 18v2"></path><path d="M20 18v2"></path><path d="M12 4v9"></path></svg></div><div class="eroom-info"><div class="eroom-name">Living</div><div class="eroom-home-tag">Casa Pilar</div><div class="eroom-bar-wrap"><div class="eroom-bar" style="width: 50%; background: rgb(99, 102, 241);"></div></div></div><div class="eroom-kwh">0.9<span> kWh</span></div></div><div class="eroom-row"><div class="eroom-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="bed" aria-hidden="true" class="lucide lucide-bed"><path d="M2 4v16"></path><path d="M2 8h18a2 2 0 0 1 2 2v10"></path><path d="M2 17h20"></path><path d="M6 8v9"></path></svg></div><div class="eroom-info"><div class="eroom-name">Hab. principal</div><div class="eroom-home-tag">Casa Pilar</div><div class="eroom-bar-wrap"><div class="eroom-bar" style="width: 61%; background: rgb(99, 102, 241);"></div></div></div><div class="eroom-kwh">1.1<span> kWh</span></div></div><div class="eroom-row"><div class="eroom-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="bed" aria-hidden="true" class="lucide lucide-bed"><path d="M2 4v16"></path><path d="M2 8h18a2 2 0 0 1 2 2v10"></path><path d="M2 17h20"></path><path d="M6 8v9"></path></svg></div><div class="eroom-info"><div class="eroom-name">Habitación 2</div><div class="eroom-home-tag">Casa Pilar</div><div class="eroom-bar-wrap"><div class="eroom-bar" style="width: 33%; background: rgb(99, 102, 241);"></div></div></div><div class="eroom-kwh">0.6<span> kWh</span></div></div><div class="eroom-row"><div class="eroom-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="trees" aria-hidden="true" class="lucide lucide-trees"><path d="M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z"></path><path d="M7 16v6"></path><path d="M13 19v3"></path><path d="M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3l-1.4 1.5"></path></svg></div><div class="eroom-info"><div class="eroom-name">Jardín</div><div class="eroom-home-tag">Casa Pilar</div><div class="eroom-bar-wrap"><div class="eroom-bar" style="width: 22%; background: rgb(99, 102, 241);"></div></div></div><div class="eroom-kwh">0.4<span> kWh</span></div></div><div class="eroom-row"><div class="eroom-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="briefcase" aria-hidden="true" class="lucide lucide-briefcase"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path><rect width="20" height="14" x="2" y="6" rx="2"></rect></svg></div><div class="eroom-info"><div class="eroom-name">Oficina</div><div class="eroom-home-tag">Casa Pilar</div><div class="eroom-bar-wrap"><div class="eroom-bar" style="width: 56%; background: rgb(99, 102, 241);"></div></div></div><div class="eroom-kwh">1<span> kWh</span></div></div><div class="eroom-row"><div class="eroom-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="utensils-crossed" aria-hidden="true" class="lucide lucide-utensils-crossed"><path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8"></path><path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7"></path><path d="m2.1 21.8 6.4-6.3"></path><path d="m19 5-7 7"></path></svg></div><div class="eroom-info"><div class="eroom-name">Comedor</div><div class="eroom-home-tag">Casa Pilar</div><div class="eroom-bar-wrap"><div class="eroom-bar" style="width: 39%; background: rgb(99, 102, 241);"></div></div></div><div class="eroom-kwh">0.7<span> kWh</span></div></div></div></div><div class="energia-top"><div class="echart-header" style="margin-bottom: 14px;"><span class="echart-title">Mayores consumidores</span><span class="echart-sub">Casa Ciudad · Casa Pilar</span></div><div class="etop-list"><div class="etop-row"><div class="etop-icon off"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="wind" aria-hidden="true" class="lucide lucide-wind"><path d="M12.8 19.6A2 2 0 1 0 14 16H2"></path><path d="M17.5 8a2.5 2.5 0 1 1 2 4H2"></path><path d="M9.8 4.4A2 2 0 1 1 11 8H2"></path></svg></div><div class="etop-info"><div class="etop-name">Aire acondicionado</div><div class="etop-room">Sala de estar · Casa Ciudad</div></div><div class="etop-right"><span class="etop-kwh">1.4 kWh</span><div class="etop-bar-track"><div class="etop-bar-fill" style="width: 100%;"></div></div></div></div><div class="etop-row"><div class="etop-icon on"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="wind" aria-hidden="true" class="lucide lucide-wind"><path d="M12.8 19.6A2 2 0 1 0 14 16H2"></path><path d="M17.5 8a2.5 2.5 0 1 1 2 4H2"></path><path d="M9.8 4.4A2 2 0 1 1 11 8H2"></path></svg></div><div class="etop-info"><div class="etop-name">Aire acondicionado</div><div class="etop-room">Hab. principal · Casa Pilar</div></div><div class="etop-right"><span class="etop-kwh">1.4 kWh</span><div class="etop-bar-track"><div class="etop-bar-fill" style="width: 100%;"></div></div></div></div><div class="etop-row"><div class="etop-icon off"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2"></rect><line x1="2" y1="7" x2="22" y2="7"></line><circle cx="6.5" cy="4.5" r="1.2"></circle><circle cx="12" cy="4.5" r="1.2"></circle><circle cx="17.5" cy="4.5" r="1.2"></circle><rect x="3.5" y="8.5" width="17" height="11.5" rx="1.5"></rect><line x1="8.5" y1="10.5" x2="15.5" y2="10.5"></line><line x1="5" y1="15.5" x2="19" y2="15.5" stroke-dasharray="2 1.5"></line><line x1="5" y1="18" x2="19" y2="18" stroke-dasharray="2 1.5"></line></svg></div><div class="etop-info"><div class="etop-name">Horno</div><div class="etop-room">Cocina · Casa Ciudad</div></div><div class="etop-right"><span class="etop-kwh">0.9 kWh</span><div class="etop-bar-track"><div class="etop-bar-fill" style="width: 64%;"></div></div></div></div><div class="etop-row"><div class="etop-icon on"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="thermometer" aria-hidden="true" class="lucide lucide-thermometer"><path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"></path></svg></div><div class="etop-info"><div class="etop-name">Heladera</div><div class="etop-room">Cocina · Casa Ciudad</div></div><div class="etop-right"><span class="etop-kwh">0.8 kWh</span><div class="etop-bar-track"><div class="etop-bar-fill" style="width: 57%;"></div></div></div></div><div class="etop-row"><div class="etop-icon off"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="bot" aria-hidden="true" class="lucide lucide-bot"><path d="M12 8V4H8"></path><rect width="16" height="12" x="4" y="8" rx="2"></rect><path d="M2 14h2"></path><path d="M20 14h2"></path><path d="M15 13v2"></path><path d="M9 13v2"></path></svg></div><div class="etop-info"><div class="etop-name">Aspiradora</div><div class="etop-room">Comedor · Casa Pilar</div></div><div class="etop-right"><span class="etop-kwh">0.6 kWh</span><div class="etop-bar-track"><div class="etop-bar-fill" style="width: 43%;"></div></div></div></div></div></div></div>
</template>



<style scoped>
.energia-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 24px;
}
.energia-screen-title {
    font-size: 1.45rem !important;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--text);
}
.energia-period-tabs {
    display: inline-flex;
    align-items: center;
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: 12px;
    padding: 4px;
    gap: 4px;
    box-shadow: 0 1px 4px rgba(15, 23, 42, .04);
}
.eperiod-btn {
    padding: 7px 16px;
    border-radius: 10px;
    border: none;
    background: none;
    font-size: 0.82rem;
    font-weight: 700;
    color: var(--text-muted);
    cursor: pointer;
    font-family: inherit;
    transition: all 0.18s;
}
.eperiod-btn.active {
    background: var(--accent-light);
    color: var(--accent);
    box-shadow: none;
}

/* KPI cards */
.energia-kpi-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 18px;
    margin-bottom: 28px;
}
.ekpi-card {
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: 16px;
    padding: 20px 22px 18px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-height: 168px;
    box-shadow: 0 2px 10px rgba(15, 23, 42, .06);
}
.ekpi-icon-wrap {
    width: 50px;
    height: 50px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
}
.ekpi-icon-wrap svg { width: 24px; height: 24px; }
.ekpi-kwh .ekpi-icon-wrap {
    background: rgba(59, 130, 246, .14);
    color: #2563EB;
}
.ekpi-cost .ekpi-icon-wrap {
    background: rgba(34, 197, 94, .14);
    color: #16A34A;
}
.ekpi-month .ekpi-icon-wrap {
    background: rgba(245, 158, 11, .14);
    color: #D97706;
}
.ekpi-co2 .ekpi-icon-wrap {
    background: rgba(16, 185, 129, .14);
    color: #059669;
}
.ekpi-val {
    font-size: 2rem;
    font-weight: 800;
    line-height: 1.05;
    color: var(--text);
    letter-spacing: -0.03em;
}
.ekpi-unit {
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--text);
}
.ekpi-label {
    font-size: 0.88rem;
    color: var(--text-muted);
    font-weight: 500;
}
.ekpi-trend {
    font-size: 0.82rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: auto;
}
.ekpi-trend svg { width: 12px; height: 12px; }
.ekpi-trend--up { color: var(--success); }
.ekpi-trend--down { color: var(--danger); }
.ekpi-trend--neutral { color: var(--text-muted); }

/* Charts row */
.energia-charts-row {
    display: grid;
    grid-template-columns: 1fr 280px;
    gap: 16px;
    margin-bottom: 24px;
}
@media (max-width: 700px) {
    .energia-charts-row { grid-template-columns: 1fr; }
}
.energia-chart-card {
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(15, 23, 42, .05);
}
.echart-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    flex-wrap: wrap;
}
.echart-title { font-size: 0.92rem; font-weight: 700; color: var(--text); }
.echart-sub   { font-size: 0.75rem; color: var(--text-muted); }
.echart-body  {
    height: 200px;
    margin-top: 16px;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 14px;
}
.echart-body--donut { height: 180px; }

/* Per-home breakdown */
.energia-breakdown {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 1px 4px rgba(0,0,0,.04);
}
.energia-home-tabs { display: flex; gap: 6px; }
.ehome-tab {
    padding: 5px 14px;
    border-radius: 99px;
    border: 1.5px solid var(--border);
    background: none;
    font-size: 0.75rem; font-weight: 600;
    color: var(--text-muted);
    cursor: pointer; font-family: inherit;
    transition: all 0.18s;
}
.ehome-tab.active {
    background: var(--primary, #1A237E);
    border-color: var(--primary, #1A237E);
    color: #fff;
}
.eroom-list { display: flex; flex-direction: column; gap: 10px; margin-top: 16px; }
.eroom-row  { display: flex; align-items: center; gap: 12px; }
.eroom-icon {
    width: 30px; height: 30px;
    border-radius: 8px;
    background: var(--surface2);
    display: flex; align-items: center; justify-content: center;
    color: var(--primary-light, #3F51B5);
    flex-shrink: 0;
}
.eroom-icon svg { width: 14px; height: 14px; }
.eroom-info { flex: 1; min-width: 0; }
.eroom-name { font-size: 0.75rem; font-weight: 600; margin-bottom: 2px; }
.eroom-home-tag { font-size: 0.68rem; color: var(--text-muted); margin-bottom: 4px; }
.eroom-bar-wrap {
    height: 7px;
    background: var(--surface2);
    border-radius: 99px;
    overflow: hidden;
}
.eroom-bar {
    height: 100%;
    border-radius: 99px;
    transition: width 0.5s cubic-bezier(.4,0,.2,1);
}
.eroom-kwh {
    font-size: 0.75rem; font-weight: 700;
    color: var(--primary, #1A237E);
    white-space: nowrap;
    min-width: 58px; text-align: right;
}
.eroom-kwh span { font-weight: 500; color: var(--text-muted); }

/* Top consumers */
.energia-top {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 1px 4px rgba(0,0,0,.04);
}
.etop-list { display: flex; flex-direction: column; gap: 10px; }
.etop-row {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 12px;
    border-radius: 12px;
    cursor: pointer;
    transition: background 0.15s;
}
.etop-row:hover { background: var(--surface2); }
.etop-icon {
    width: 36px; height: 36px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
}
.etop-icon.on  { background: rgba(26,35,126,.10); color: var(--primary, #1A237E); }
.etop-icon.off { background: var(--surface2); color: var(--text-muted); }
.etop-icon svg { width: 17px; height: 17px; }
.etop-info { flex: 1; min-width: 0; }
.etop-name { font-size: 0.8125rem; font-weight: 600; }
.etop-room { font-size: 0.6875rem; color: var(--text-muted); margin-top: 1px; }
.etop-right { display: flex; flex-direction: column; align-items: flex-end; gap: 5px; min-width: 80px; }
.etop-kwh { font-size: 0.8125rem; font-weight: 700; color: var(--primary, #1A237E); }
.etop-bar-track {
    width: 70px; height: 5px;
    background: var(--surface2);
    border-radius: 99px;
    overflow: hidden;
}
.etop-bar-fill {
    height: 100%;
    background: linear-gradient(to right, #1A237E, #3F51B5);
    border-radius: 99px;
    transition: width 0.5s cubic-bezier(.4,0,.2,1);
}

</style>