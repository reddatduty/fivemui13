local uiOpen = false

local function getVehicle()
    local ped = PlayerPedId()
    local veh = GetVehiclePedIsIn(ped, false)
    if veh == 0 then return nil end
    return veh
end

local function openTuning()
    local veh = getVehicle()
    if not veh then
        TriggerEvent('chat:addMessage', { args = { '^2TUNING', 'Enter a vehicle first.' } })
        return
    end

    uiOpen = true
    SetNuiFocus(true, true)

    local model = GetEntityModel(veh)
    local label = GetDisplayNameFromVehicleModel(model)
    local name = GetLabelText(label)
    if name == 'NULL' then name = label end

    SendNUIMessage({
        action = 'open',
        vehicle = {
            name = name,
            plate = GetVehicleNumberPlateText(veh),
            maxSpeed = math.floor(GetVehicleEstimatedMaxSpeed(veh) * 3.6)
        }
    })
end

RegisterCommand('tuningui', openTuning, false)
RegisterKeyMapping('tuningui', 'Open vehicle tuning UI', 'keyboard', 'F7')

RegisterNUICallback('close', function(_, cb)
    uiOpen = false
    SetNuiFocus(false, false)
    cb({ ok = true })
end)

RegisterNUICallback('preview', function(data, cb)
    -- Front-end preview event. Hook your real tuning logic here.
    -- data.category, data.id, data.value and data.meta are supplied by the UI.
    TriggerEvent('fivemui13:preview', data)
    cb({ ok = true })
end)

RegisterNUICallback('revertPreview', function(data, cb)
    TriggerEvent('fivemui13:revertPreview', data)
    cb({ ok = true })
end)

RegisterNUICallback('checkout', function(data, cb)
    -- Integrate this event with your economy/server-side validation.
    -- Never trust browser-side prices on a production server.
    TriggerServerEvent('fivemui13:checkout', data)
    cb({ ok = true })
end)

RegisterNUICallback('requestVehicleSupport', function(_, cb)
    local veh = getVehicle()
    if not veh then
        cb({ supported = {} })
        return
    end

    SetVehicleModKit(veh, 0)

    local supported = {}
    for modType = 0, 48 do
        local count = GetNumVehicleMods(veh, modType)
        if count and count > 0 then
            supported[tostring(modType)] = count
        end
    end

    cb({ supported = supported })
end)

CreateThread(function()
    while true do
        if uiOpen and IsControlJustPressed(0, 322) then
            uiOpen = false
            SetNuiFocus(false, false)
            SendNUIMessage({ action = 'close' })
        end
        Wait(uiOpen and 0 or 300)
    end
end)
