package com.carddex.sims2.rest.dto;

/**
 *
 * @author uvm
 */

public class DeviceDto {

	private Integer id;
	private String name;
	private String description;
	private Integer enabled;
	private Connection connection;
	private Device device;
	private Access access;

	public DeviceDto() {
	}

	//@formatter:off
	public DeviceDto(Integer id, String name, String description, Integer enabled,
			Integer typeId, Integer connectionId, Integer protocolId,
			Integer dbConnectionId, Integer[] directionOpenMask,
			Integer zoneAId, Integer zoneBId, Integer accessModeAB, Integer accessModeBA) {
		
		this.id = id;
		this.name = name;
		this.description = description;
		this.enabled = enabled;
		this.connection = new Connection(typeId, connectionId, protocolId);
		this.device = new Device(dbConnectionId, directionOpenMask);
		this.access = new Access(zoneAId, zoneBId, accessModeAB, accessModeBA);
	}
	//@formatter:on
	
	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Integer getEnabled() {
		return enabled;
	}

	public void setEnabled(Integer enabled) {
		this.enabled = enabled;
	}

	public Connection getConnection() {
		return connection;
	}

	public void setConnection(Connection connection) {
		this.connection = connection;
	}

	public Device getDevice() {
		return device;
	}

	public void setDevice(Device device) {
		this.device = device;
	}

	public Access getAccess() {
		return access;
	}

	public void setAccess(Access access) {
		this.access = access;
	}

	private class Connection {
		private Integer typeId;
		private Integer connectionId;
		private Integer protocolId;

		public Connection(Integer typeId, Integer connectionId, Integer protocolId) {
			this.typeId = typeId;
			this.connectionId = connectionId;
			this.protocolId = protocolId;
		}

		public Integer getTypeId() {
			return typeId;
		}

		public void setTypeId(Integer typeId) {
			this.typeId = typeId;
		}

		public Integer getConnectionId() {
			return connectionId;
		}

		public void setConnectionId(Integer connectionId) {
			this.connectionId = connectionId;
		}

		public Integer getProtocolId() {
			return protocolId;
		}

		public void setProtocolId(Integer protocolId) {
			this.protocolId = protocolId;
		}
	}

	private class Device {
		private Integer dbConnectionId;
		private Integer[] directionOpenMask;

		public Device(Integer dbConnectionId, Integer[] directionOpenMask) {
			this.dbConnectionId = dbConnectionId;
			this.directionOpenMask = directionOpenMask;
		}

		public Integer getDbConnectionId() {
			return dbConnectionId;
		}

		public void setDbConnectionId(Integer dbConnectionId) {
			this.dbConnectionId = dbConnectionId;
		}

		public Integer[] getDirectionOpenMask() {
			return directionOpenMask;
		}

		public void setDirectionOpenMask(Integer[] directionOpenMask) {
			this.directionOpenMask = directionOpenMask;
		}
		
	}

	private class Access {
		private Integer zoneAId;
		private Integer zoneBId;
		private Integer accessModeAB;
		private Integer accessModeBA;

		public Access(Integer zoneAId, Integer zoneBId, Integer accessModeAB, Integer accessModeBA) {
			super();
			this.zoneAId = zoneAId;
			this.zoneBId = zoneBId;
			this.accessModeAB = accessModeAB;
			this.accessModeBA = accessModeBA;
		}

		public Integer getZoneAId() {
			return zoneAId;
		}

		public void setZoneAId(Integer zoneAId) {
			this.zoneAId = zoneAId;
		}

		public Integer getZoneBId() {
			return zoneBId;
		}

		public void setZoneBId(Integer zoneBId) {
			this.zoneBId = zoneBId;
		}

		public Integer getAccessModeAB() {
			return accessModeAB;
		}

		public void setAccessModeAB(Integer accessModeAB) {
			this.accessModeAB = accessModeAB;
		}

		public Integer getAccessModeBA() {
			return accessModeBA;
		}

		public void setAccessModeBA(Integer accessModeBA) {
			this.accessModeBA = accessModeBA;
		}
		
	}
}
