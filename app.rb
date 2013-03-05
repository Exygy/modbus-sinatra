class ModbusTester < Sinatra::Base

  # Display the input form
  get '/' do
    slim :form
  end

  # Post form data and respond with JSON of modbus connection result
  post '/modbus_test' do

    # grab form inputs, or use default values 
    ip_address = params[:ip_address]
    port       = params[:port].empty? ? 502 : params[:port].to_i
    slave_val  = params[:slave].empty? ? 1 : params[:slave].to_i
    register1  = params[:register1].empty? ? 1 : params[:register1].to_i
    register2  = params[:register2].empty? ? 2 : params[:register2].to_i
    scale      = params[:scale].empty? ? 1.0 : params[:scale].to_f
    format     = params[:format].empty? ? '32f' : params[:format]

    # have to adjust, registers are 1 off
    register1 -= 1
    register2 -= 1

    result = {}

    case params[:connection]
    when 'tcp'
      modbusClient = ModBus::TCPClient
    when 'rtu'
      modbusClient = ModBus::RTUViaTCPClient
    end

    begin
      modbusClient.new(ip_address, port) do |cl|
        cl.with_slave(slave_val) do |slave|
          slave.debug = true
          # Read holding registers
          values = slave.holding_registers[register1..register2]
          result[:values] = values
          # use either .to_32f or .to_32i for computation 
          # also round to 4 decimal places 
          result[:computed] = (scale * (values.reverse.send("to_#{format}").first)).round(4)
          result[:gmt] = Time.now.utc.strftime('%H:%M:%S GMT')
        end
      end      
    rescue Exception => e
      # catch Exception (e.g. Connection timed out)
      # puts e.backtrace ## enable if you want to see the backtrace in the server log 
      result[:errors]     = e.message
      result[:error_type] = e.class 
    end

    # display result as JSON 
    content_type :json
    result.to_json

  end

end


